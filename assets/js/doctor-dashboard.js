document.addEventListener('DOMContentLoaded', () => {
    const prescriptionsList = document.getElementById('recent-prescriptions-list');

    // Fetch recent prescriptions for this doctor
    fetch('../../controller/get-prescription-history.php', { credentials: 'same-origin' })
        .then(res => {
            if (res.status === 401) {
                prescriptionsList.innerHTML = '<p class="error">Please log in to view prescriptions.</p>';
                return null;
            }
            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            if (data === null) return;
            
            prescriptionsList.innerHTML = '';
            
            if (!Array.isArray(data) || data.length === 0) {
                prescriptionsList.innerHTML = '<p class="no-data">No prescriptions found.</p>';
                return;
            }

            // Show only the 5 most recent prescriptions
            const recentPrescriptions = data.slice(0, 5);
            
            recentPrescriptions.forEach(item => {
                const prescriptionItem = document.createElement('div');
                prescriptionItem.className = 'prescription-item';
                
                const formatDate = (dateString) => {
                    if (!dateString) return 'N/A';
                    const date = new Date(dateString);
                    return isNaN(date) ? 'N/A' : date.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                    });
                };

                prescriptionItem.innerHTML = `
                    <div class="prescription-date">${formatDate(item.dateGiven)}</div>
                    <div class="prescription-info">
                        <div class="prescription-doctor">${item.clientFirstName || ''} ${item.clientLastName || ''}</div>
                        <div class="prescription-expiry">Expires: ${formatDate(item.dateExpiry)}</div>
                    </div>
                `;
                
                prescriptionItem.style.cursor = 'pointer';
                prescriptionItem.addEventListener('click', () => {
                    showPrescriptionDetails(item.prescID, item);
                });
                
                prescriptionsList.appendChild(prescriptionItem);
            });
        })
        .catch(err => {
            console.error('Failed to fetch prescriptions:', err);
            prescriptionsList.innerHTML = '<p class="error">Error loading prescriptions. Please try again.</p>';
        });
});

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showPrescriptionDetails(prescID, prescriptionData) {
    const modal = document.getElementById('prescription-details-modal');
    const detailsBody = document.getElementById('prescription-details-body');
    
    if (!modal || !detailsBody) return;
    
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
            
            // Build the details HTML
            let html = `
                <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e2e8f0;">
                    <h4 style="margin: 0 0 10px 0; color: #0f172a;">Patient Information</h4>
                    <p style="margin: 5px 0;"><strong>Name:</strong> ${escapeHtml(data.clientFirstName || '')} ${escapeHtml(data.clientLastName || '')}</p>
                    <p style="margin: 5px 0;"><strong>Prescription ID:</strong> ${escapeHtml(prescID)}</p>
                    <p style="margin: 5px 0;"><strong>Date Given:</strong> ${formatDate(prescriptionData.dateGiven)}</p>
                    <p style="margin: 5px 0;"><strong>Expiry Date:</strong> ${formatDate(prescriptionData.dateExpiry)}</p>
                </div>
            `;
            
            if (data.medicines && data.medicines.length > 0) {
                html += `
                    <div>
                        <h4 style="margin: 0 0 15px 0; color: #0f172a;">Medications</h4>
                        <div style="display: grid; gap: 15px;">
                `;
                
                data.medicines.forEach((medicine, index) => {
                    html += `
                        <div style="padding: 15px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 8px 0;"><strong style="color: #0f172a; font-size: 16px;">${escapeHtml(medicine.medicineName || 'N/A')}</strong></p>
                            <p style="margin: 5px 0; color: #475569;"><strong>Dosage:</strong> ${escapeHtml(medicine.dosage || 'N/A')}</p>
                            <p style="margin: 5px 0; color: #475569;"><strong>Amount Remaining:</strong> ${medicine.amountRemaining ?? 'N/A'}</p>
                        </div>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
            } else {
                html += '<p style="color: #64748b;">No medications found for this prescription.</p>';
            }
            
            detailsBody.innerHTML = html;
        })
        .catch(err => {
            console.error('Failed to fetch prescription details:', err);
            detailsBody.innerHTML = '<p class="error">Error loading prescription details. Please try again.</p>';
        });
    
    // Close button functionality
    const closeBtn = modal.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            detailsBody.innerHTML = '';
        };
    }
    
    // Close modal when clicking outside (on the modal background)
    modal.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            detailsBody.innerHTML = '';
        }
    };
}

