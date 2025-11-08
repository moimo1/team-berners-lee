document.addEventListener('DOMContentLoaded', () => {
    // Sidebar toggle is handled in sidebar.php script
    // No need to duplicate the initialization here

    // Load clients
    loadClients();

    // Search functionality
    const searchInput = document.getElementById('search-client');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
});

function loadClients() {
    const tbody = document.getElementById('clients-table-body');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="5" class="loading">Loading clients...</td></tr>';

    fetch('../../controller/get-all-clients.php', {
        credentials: 'same-origin'
    })
    .then(res => {
        if (!res.ok) throw new Error('Failed to fetch clients');
        return res.json();
    })
    .then(data => {
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="no-data">No clients found</td></tr>';
            return;
        }

        // Count active prescriptions for each client
        const clientPrescriptionCounts = {};
        fetch('../../controller/get-all-prescriptions.php', {
            credentials: 'same-origin'
        })
        .then(res => res.json())
        .then(prescriptions => {
            prescriptions.forEach(prescription => {
                const clientId = prescription.clientID;
                if (!clientPrescriptionCounts[clientId]) {
                    clientPrescriptionCounts[clientId] = 0;
                }
                const expiryDate = new Date(prescription.dateExpiry);
                const now = new Date();
                if (expiryDate >= now) {
                    clientPrescriptionCounts[clientId]++;
                }
            });

            data.forEach(client => {
                const row = document.createElement('tr');
                const activeCount = clientPrescriptionCounts[client.clientID] || 0;
                
                row.innerHTML = `
                    <td>${escapeHtml(client.firstName || '')} ${escapeHtml(client.lastName || '')}</td>
                    <td>${escapeHtml(client.email || 'N/A')}</td>
                    <td>${escapeHtml(client.contacts || 'N/A')}</td>
                    <td>${activeCount}</td>
                    <td>
                        <a href="./prescription-details.php?clientID=${client.clientID}" class="view-prescriptions-btn">
                            View Prescriptions
                        </a>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(err => {
            console.error('Error loading prescription counts:', err);
            // Still show clients without prescription counts
            data.forEach(client => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${escapeHtml(client.firstName || '')} ${escapeHtml(client.lastName || '')}</td>
                    <td>${escapeHtml(client.email || 'N/A')}</td>
                    <td>${escapeHtml(client.contacts || 'N/A')}</td>
                    <td>0</td>
                    <td>
                        <a href="./prescription-details.php?clientID=${client.clientID}" class="view-prescriptions-btn">
                            View Prescriptions
                        </a>
                    </td>
                `;
                tbody.appendChild(row);
            });
        });
    })
    .catch(err => {
        console.error('Error loading clients:', err);
        tbody.innerHTML = '<tr><td colspan="5" class="error">Failed to load clients</td></tr>';
    });
}

function handleSearch() {
    const searchInput = document.getElementById('search-client');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    const rows = document.querySelectorAll('#clients-table-body tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

