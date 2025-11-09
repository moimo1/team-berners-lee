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
        
        var brandHtml = '';
        if (medicine.brand && medicine.brand.trim()) {
            brandHtml = '<p class="medicine-brand">' + escapeHtml(medicine.brand) + '</p>';
        }
        
        var descriptionHtml = '';
        if (medicine.description && medicine.description.trim()) {
            descriptionHtml = `
                <div class="medicine-description">
                    <div class="medicine-description-label">Description</div>
                    <p class="medicine-description-text">${escapeHtml(medicine.description)}</p>
                </div>
            `;
        }
        
        item.innerHTML = `
            <div class="medicine-header">
                <div>
                    <h4 class="medicine-name">${escapeHtml(medicine.genericName || 'Unknown Medicine')}</h4>
                    ${brandHtml}
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
            ${descriptionHtml}
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

    function performSearch() {
        var query = searchInput.value.trim();
        var searchTypeValue = searchType.value;
        
        // If query is empty, show placeholder message
        if (!query) {
            searchResults.innerHTML = '<p class="no-results">Enter a drug name to search for medicine information.</p>';
            return;
        }

        setLoading(true);

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
    }

    // Debounce function to limit API calls while typing
    var searchTimeout;
    function debounceSearch() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function() {
            performSearch();
        }, 300); // Wait 300ms after user stops typing
    }

    // Real-time search as user types
    searchInput.addEventListener('input', function() {
        debounceSearch();
    });

    // Also listen for search type changes
    searchType.addEventListener('change', function() {
        if (searchInput.value.trim()) {
            debounceSearch();
        }
    });

    // Keep form submission for manual search (optional, but good for accessibility)
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearTimeout(searchTimeout); // Cancel any pending debounced search
        performSearch();
    });
})();

