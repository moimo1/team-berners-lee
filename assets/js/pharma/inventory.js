document.addEventListener('DOMContentLoaded', () => {
    // Initialize sidebar toggle
    const dashboard = document.getElementById('pharmacistDashboard');
    const toggle = document.getElementById('sidebarToggle');
    if (dashboard && toggle) {
        toggle.addEventListener('click', function(){
            dashboard.classList.toggle('sidebar-expanded');
            const expanded = dashboard.classList.contains('sidebar-expanded');
            toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        });
    }

    // Load inventory
    loadInventory();

    // Search functionality
    const searchInput = document.getElementById('search-medicine');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // Modal functionality
    setupModals();

    // Add medicine button
    const addMedicineBtn = document.getElementById('add-medicine-btn');
    if (addMedicineBtn) {
        addMedicineBtn.addEventListener('click', () => {
            openModal('addMedicineModal');
        });
    }

    // Form submissions
    const addForm = document.getElementById('add-medicine-form');
    if (addForm) {
        addForm.addEventListener('submit', handleAddMedicine);
    }

    const updateForm = document.getElementById('update-inventory-form');
    if (updateForm) {
        updateForm.addEventListener('submit', handleUpdateInventory);
    }
});

function setupModals() {
    // Close modal on X click
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalId = e.target.getAttribute('data-modal');
            closeModal(modalId);
        });
    });

    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Reset form if it's the add medicine modal
        if (modalId === 'addMedicineModal') {
            const form = document.getElementById('add-medicine-form');
            if (form) form.reset();
        }
    }
}

function loadInventory() {
    const tbody = document.getElementById('inventory-table-body');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="6" class="loading">Loading inventory...</td></tr>';

    fetch('../../controller/get-inventory.php', {
        credentials: 'same-origin'
    })
    .then(res => {
        if (!res.ok) throw new Error('Failed to fetch inventory');
        return res.json();
    })
    .then(data => {
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">No inventory items found</td></tr>';
            return;
        }

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${escapeHtml(item.name || item.genericName || 'N/A')}</td>
                <td>${escapeHtml(item.brand || 'N/A')}</td>
                <td>${escapeHtml(item.amount || item.stock || '0')}</td>
                <td>${formatDate(item.expiryDate) || 'N/A'}</td>
                <td>${escapeHtml(item.supplier || 'N/A')}</td>
                <td>
                    <button class="update-btn" onclick="openUpdateModal(${item.id || item.medID}, '${escapeHtml(item.name || item.genericName)}', '${escapeHtml(item.brand)}', ${item.amount || item.stock}, '${item.expiryDate}', '${escapeHtml(item.supplier || '')}')">
                        Update
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(err => {
        console.error('Error loading inventory:', err);
        tbody.innerHTML = '<tr><td colspan="6" class="error">Failed to load inventory</td></tr>';
    });
}

function openUpdateModal(id, name, brand, stock, expiryDate, supplier) {
    document.getElementById('update-medicine-id').value = id;
    document.getElementById('update-medicine-name').value = name;
    document.getElementById('update-medicine-brand').value = brand;
    document.getElementById('update-stock').value = stock;
    document.getElementById('update-expiry-date').value = expiryDate;
    document.getElementById('update-supplier').value = supplier;
    
    openModal('updateInventoryModal');
}

function handleSearch() {
    const searchInput = document.getElementById('search-medicine');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    const rows = document.querySelectorAll('#inventory-table-body tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function handleAddMedicine(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        medicine_name: formData.get('medicine_name'),
        medicine_brand: formData.get('medicine_brand'),
        stock: formData.get('stock'),
        expiry_date: formData.get('expiry_date'),
        supplier: formData.get('supplier')
    };

    fetch('../../controller/add-inventory.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            closeModal('addMedicineModal');
            loadInventory();
        } else {
            alert('Failed to add medicine: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(err => {
        console.error('Error adding medicine:', err);
        alert('Failed to add medicine. Please try again.');
    });
}

function handleUpdateInventory(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        medicine_id: formData.get('medicine_id'),
        medicine_brand: formData.get('medicine_brand'),
        stock: formData.get('stock'),
        expiry_date: formData.get('expiry_date'),
        supplier: formData.get('supplier')
    };

    fetch('../../controller/update-inventory.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            closeModal('updateInventoryModal');
            loadInventory();
        } else {
            alert('Failed to update inventory: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(err => {
        console.error('Error updating inventory:', err);
        alert('Failed to update inventory. Please try again.');
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

// Make functions available globally for onclick handlers
window.openUpdateModal = openUpdateModal;

