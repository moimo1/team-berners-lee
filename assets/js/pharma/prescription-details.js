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

    // Load active prescriptions
    loadActivePrescriptions();

    // Modal functionality
    setupModals();

    // Form submission
    const updateForm = document.getElementById('update-prescription-form');
    if (updateForm) {
        updateForm.addEventListener('submit', handleUpdatePrescription);
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
    }
}

function loadActivePrescriptions() {
    const tbody = document.getElementById('prescriptions-table-body');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="5" class="loading">Loading prescriptions...</td></tr>';

    fetch('../../controller/get-all-prescriptions.php', {
        credentials: 'same-origin'
    })
    .then(res => {
        if (!res.ok) throw new Error('Failed to fetch prescriptions');
        return res.json();
    })
    .then(data => {
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="no-data">No active prescriptions found</td></tr>';
            return;
        }

        data.forEach(prescription => {
            const row = document.createElement('tr');
            const expiryDate = new Date(prescription.dateExpiry);
            const now = new Date();
            const isExpired = expiryDate < now;
            const status = isExpired ? 'expired' : 'active';
            const statusText = isExpired ? 'Expired' : 'Active';

            row.innerHTML = `
                <td>${escapeHtml(prescription.clientFirstName || '')} ${escapeHtml(prescription.clientLastName || '')}</td>
                <td>
                    <button class="see-prescription-btn" onclick="viewPrescriptionDetails('${prescription.prescID}')">
                        See prescription
                    </button>
                </td>
                <td>${formatDate(prescription.dateExpiry)}</td>
                <td>
                    <span class="status-btn ${status}">${statusText}</span>
                </td>
                <td>
                    <button class="update-btn" onclick="openUpdatePrescriptionModal('${prescription.prescID}')">
                        Update
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(err => {
        console.error('Error loading prescriptions:', err);
        tbody.innerHTML = '<tr><td colspan="5" class="error">Failed to load prescriptions</td></tr>';
    });
}

function viewPrescriptionDetails(prescID) {
    const modal = document.getElementById('prescriptionDetailsModal');
    const content = document.getElementById('prescription-details-content');
    
    content.innerHTML = '<p class="loading">Loading prescription details...</p>';
    openModal('prescriptionDetailsModal');

    fetch(`../../controller/get-prescription-details.php?prescID=${prescID}`, {
        credentials: 'same-origin'
    })
    .then(res => {
        if (!res.ok) throw new Error('Failed to fetch prescription details');
        return res.json();
    })
    .then(data => {
        if (data.length === 0) {
            content.innerHTML = '<p class="no-data">No prescription details found</p>';
            return;
        }

        let html = '<table class="prescription-details-table">';
        html += '<thead><tr><th>Medicine Name</th><th>Dosage</th><th>Amount Remaining</th></tr></thead>';
        html += '<tbody>';
        
        data.forEach(detail => {
            html += `
                <tr>
                    <td>${escapeHtml(detail.genericName || detail.name || 'N/A')}</td>
                    <td>${escapeHtml(detail.dosage || 'N/A')}</td>
                    <td>${escapeHtml(detail.remainingAmount || '0')}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        content.innerHTML = html;
    })
    .catch(err => {
        console.error('Error loading prescription details:', err);
        content.innerHTML = '<p class="error">Failed to load prescription details</p>';
    });
}

function openUpdatePrescriptionModal(prescID) {
    // Fetch prescription details to populate the form
    fetch(`../../controller/get-prescription-details.php?prescID=${prescID}`, {
        credentials: 'same-origin'
    })
    .then(res => {
        if (!res.ok) throw new Error('Failed to fetch prescription details');
        return res.json();
    })
    .then(data => {
        if (data.length === 0) {
            alert('No prescription details found');
            return;
        }

        // Use the first medicine for the update form
        const detail = data[0];
        document.getElementById('update-prescription-id').value = prescID;
        document.getElementById('update-prescription-detail-id').value = detail.prescID;
        document.getElementById('update-medicine-name-presc').value = detail.genericName || detail.name || '';
        document.getElementById('update-amount').value = detail.remainingAmount || 0;
        document.getElementById('update-status').value = 'Active'; // Default status
        
        openModal('updatePrescriptionModal');
    })
    .catch(err => {
        console.error('Error loading prescription details:', err);
        alert('Failed to load prescription details');
    });
}

function handleUpdatePrescription(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        prescription_id: formData.get('prescription_id'),
        prescription_detail_id: formData.get('prescription_detail_id'),
        amount: formData.get('amount'),
        status: formData.get('status')
    };

    fetch('../../controller/update-prescription.php', {
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
            closeModal('updatePrescriptionModal');
            loadActivePrescriptions();
        } else {
            alert('Failed to update prescription: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(err => {
        console.error('Error updating prescription:', err);
        alert('Failed to update prescription. Please try again.');
    });
}

function escapeHtml(text) {
    if (!text) return '';
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
window.viewPrescriptionDetails = viewPrescriptionDetails;
window.openUpdatePrescriptionModal = openUpdatePrescriptionModal;

