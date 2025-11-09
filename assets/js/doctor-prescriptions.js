document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.querySelector('#prescription-history-tbody');
    if (!listContainer) return;

    fetch('../../controller/get-prescription-history.php', { credentials: 'same-origin' })
        .then(res => {
            if (res.status === 401) {
                listContainer.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#dc2626;">Please log in to view prescriptions.</td></tr>';
                return null;
            }
            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            if (data === null) return;
            
            renderPrescriptionList(data, listContainer);
        })
        .catch(err => {
            console.error('Failed to fetch prescription history:', err);
            listContainer.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#dc2626;">Error loading prescriptions. Please try again.</td></tr>';
        });
});

function renderPrescriptionList(data, container) {
    container.innerHTML = ''; 
    if (!data || data.length === 0) {
        container.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#64748b;">No prescriptions found</td></tr>';
        return;
    }

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = getRowContent(item);
        row.style.cursor = 'pointer';
        row.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrescriptionDetails(item.prescID, item);
        });
        container.appendChild(row);
    });
}

function getRowContent(item) {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return isNaN(date) ? 'N/A' : date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    return `
        <td>${formatDate(item.dateGiven)}</td>
        <td>${formatDate(item.dateExpiry)}</td>
        <td>${escapeHtml(item.clientFirstName || '')} ${escapeHtml(item.clientLastName || '')}</td>
    `;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showPrescriptionDetails(prescID, prescriptionData) {
    const modal = document.getElementById('prescription-details-modal');
    const detailsBody = document.getElementById('prescription-details-body');
    
    if (!modal || !detailsBody) {
        console.error('Modal elements not found');
        return;
    }
    
    // Show loading state
    detailsBody.innerHTML = '<p>Loading prescription details...</p>';
    modal.style.display = 'block';
    
    // Fetch prescription details
    fetch(`../../controller/get-prescription-details.php?prescID=${escapeHtml(prescID)}`, { 
        credentials: 'same-origin' 
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`Failed to fetch details: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            if (data.error) {
                detailsBody.innerHTML = `<p class="error">${escapeHtml(data.error)}</p>`;
                return;
            }
            
            // Format dates
            const formatDate = (dateString) => {
                if (!dateString) return 'N/A';
                const date = new Date(dateString);
                return isNaN(date) ? 'N/A' : date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
            };
            
            // Build the details HTML using CSS classes
            let html = `
                <div class="prescription-details-section">
                    <h4>Patient Information</h4>
                    <p><strong>Name:</strong> ${escapeHtml(data.clientFirstName || '')} ${escapeHtml(data.clientLastName || '')}</p>
                    <p><strong>Prescription ID:</strong> ${escapeHtml(prescID)}</p>
                    <p><strong>Date Given:</strong> ${formatDate(prescriptionData.dateGiven)}</p>
                    <p><strong>Expiry Date:</strong> ${formatDate(prescriptionData.dateExpiry)}</p>
                </div>
            `;
            
            if (data.medicines && data.medicines.length > 0) {
                html += `
                    <div class="medications-section">
                        <h4>Medications</h4>
                        <div class="medications-grid">
                `;
                
                data.medicines.forEach((medicine, index) => {
                    html += `
                        <div class="medicine-card">
                            <p class="medicine-name">${escapeHtml(medicine.medicineName || 'N/A')}</p>
                            <p><strong>Dosage:</strong> ${escapeHtml(medicine.dosage || 'N/A')}</p>
                            <p><strong>Amount Remaining:</strong> ${medicine.amountRemaining ?? 'N/A'}</p>
                        </div>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
            } else {
                html += '<p class="no-medications">No medications found for this prescription.</p>';
            }
            
            detailsBody.innerHTML = html;
        })
        .catch(err => {
            console.error('Failed to fetch prescription details:', err);
            detailsBody.innerHTML = '<p class="error">Error loading prescription details. Please try again.</p>';
        });
    
    // Close button functionality - set up once
    const closeBtn = modal.querySelector('.close-btn');
    if (closeBtn && !closeBtn.hasAttribute('data-listener-attached')) {
        closeBtn.setAttribute('data-listener-attached', 'true');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            detailsBody.innerHTML = '';
        });
    }
    
    // Close modal when clicking outside (on the modal background)
    if (!modal.hasAttribute('data-modal-listener-attached')) {
        modal.setAttribute('data-modal-listener-attached', 'true');
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                detailsBody.innerHTML = '';
            }
        });
    }
}

