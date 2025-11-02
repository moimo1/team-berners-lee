(function() {
    'use strict';

    var searchForm = document.getElementById('search-form');
    var searchResults = document.getElementById('search-results');
    var searchInput = document.getElementById('drug-name-input');
    var searchType = document.getElementById('search-type');

    if (!searchForm || !searchResults) {
        return;
    }

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        try {
            var date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        } catch (e) {
            return dateString;
        }
    }

    function displayMedicine(medicine) {
        var item = document.createElement('div');
        item.className = 'medicine-item';
        
        item.innerHTML = `
            <div class="medicine-header">
                <div>
                    <h4 class="medicine-name">${escapeHtml(medicine.genericName || 'Unknown')}</h4>
                    ${medicine.brand ? '<p class="medicine-brand">Brand: ' + escapeHtml(medicine.brand) + '</p>' : ''}
                </div>
                <span class="medicine-id">ID: ${escapeHtml(medicine.medID || 'N/A')}</span>
            </div>
            <div class="medicine-details">
                <div class="medicine-detail">
                    <span class="medicine-detail-label">Manufacture Date</span>
                    <span class="medicine-detail-value">${formatDate(medicine.manufactureDate)}</span>
                </div>
                <div class="medicine-detail">
                    <span class="medicine-detail-label">Expiry Date</span>
                    <span class="medicine-detail-value">${formatDate(medicine.expiryDate)}</span>
                </div>
            </div>
            ${medicine.description ? `
                <div class="medicine-description">
                    <div class="medicine-description-label">Description</div>
                    <p class="medicine-description-text">${escapeHtml(medicine.description)}</p>
                </div>
            ` : ''}
        `;
        
        return item;
    }

    function escapeHtml(text) {
        if (!text) return '';
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function displayResults(medicines) {
        searchResults.innerHTML = '';
        
        if (!medicines || medicines.length === 0) {
            searchResults.innerHTML = '<p class="no-results">No medicines found. Try a different search term.</p>';
            return;
        }

        medicines.forEach(function(medicine) {
            searchResults.appendChild(displayMedicine(medicine));
        });
    }

    function displayError(message) {
        searchResults.innerHTML = '<p class="error-message">' + escapeHtml(message) + '</p>';
    }

    function setLoading(loading) {
        if (loading) {
            searchResults.classList.add('loading');
        } else {
            searchResults.classList.remove('loading');
        }
    }

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var query = searchInput.value.trim();
        if (!query) {
            return;
        }

        setLoading(true);
        searchResults.innerHTML = '';

        var searchTypeValue = searchType.value;
        var url = '../../controller/search-medicine.php?query=' + encodeURIComponent(query) + '&type=' + encodeURIComponent(searchTypeValue);

        fetch(url, {
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(function(response) {
            if (response.status === 401) {
                throw new Error('Please log in to search medicines.');
            }
            
            if (!response.ok) {
                return response.json().then(function(data) {
                    throw new Error(data.message || 'Search failed. Please try again.');
                });
            }
            
            return response.json();
        })
        .then(function(data) {
            setLoading(false);
            
            if (data.error) {
                displayError(data.message || data.error);
                return;
            }
            
            displayResults(data);
        })
        .catch(function(err) {
            setLoading(false);
            displayError(err.message || 'An error occurred while searching. Please try again.');
        });
    });
})();

