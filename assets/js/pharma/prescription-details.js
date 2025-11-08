document.addEventListener('DOMContentLoaded', () => {
    // Sidebar toggle is handled in sidebar.php script
    // No need to duplicate the initialization here

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
    console.log('Opening modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    } else {
        console.error('Modal not found:', modalId);
    }
}

function closeModal(modalId) {
    console.log('Closing modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
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
    console.log('Opening update modal for prescription:', prescID);
    
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
        const prescriptionIdField = document.getElementById('update-prescription-id');
        const prescriptionDetailIdField = document.getElementById('update-prescription-detail-id');
        const medicineNameField = document.getElementById('update-medicine-name-presc');
        const amountField = document.getElementById('update-amount');
        const statusField = document.getElementById('update-status');

        if (prescriptionIdField) prescriptionIdField.value = prescID;
        if (prescriptionDetailIdField) prescriptionDetailIdField.value = detail.prescID || prescID;
        if (medicineNameField) medicineNameField.value = detail.genericName || detail.name || '';
        if (amountField) amountField.value = detail.remainingAmount || 0;
        
        // Set status based on expiry date
        if (statusField) {
            // Check if prescription is expired
            fetch('../../controller/get-all-prescriptions.php', {
                credentials: 'same-origin'
            })
            .then(res => res.json())
            .then(prescriptions => {
                const prescription = prescriptions.find(p => p.prescID === prescID);
                if (prescription) {
                    const expiryDate = new Date(prescription.dateExpiry);
                    const now = new Date();
                    if (expiryDate < now) {
                        statusField.value = 'Expired';
                    } else {
                        statusField.value = 'Active';
                    }
                }
                // Open modal after setting status
                openModal('updatePrescriptionModal');
            })
            .catch(err => {
                console.error('Error fetching prescription status:', err);
                // Still open modal with default status
                if (statusField) statusField.value = 'Active';
                openModal('updatePrescriptionModal');
            });
        } else {
            // If status field doesn't exist, just open modal
            openModal('updatePrescriptionModal');
        }
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

