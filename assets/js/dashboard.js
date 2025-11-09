document.addEventListener('DOMContentLoaded', () => {
    const prescriptionContainer = document.getElementById('medicine-list');
    const recentPrescriptionsList = document.getElementById('recent-prescriptions-list');

    // Fetch current medications
    if (prescriptionContainer) {
        fetch('../../controller/get-prescription.php', { credentials: 'same-origin' })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Request failed: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (!Array.isArray(data) || data.length === 0) {
                    prescriptionContainer.innerHTML = '<p class="no-medications">No current medications.</p>';
                    return;
                }
                
                prescriptionContainer.innerHTML = '';
                data.forEach(item => {
                    const medicineItem = document.createElement('div');
                    medicineItem.className = 'medicine-item';
                    
                    const remainingAmount = item.remainingAmount ?? null;
                    const remainingDisplay = remainingAmount === null ? 'Unlimited' : remainingAmount;
                    const remainingClass = remainingAmount === null || remainingAmount > 10 ? 'remaining-high' : 
                                                   remainingAmount > 0 ? 'remaining-medium' : 'remaining-low';
                    
                    medicineItem.innerHTML = `
                        <div class="medicine-name">${escapeHtml(item.genericName || 'Unknown Medicine')}</div>
                        <div class="medicine-info">
                            <div class="medicine-dosage">${escapeHtml(item.dosage || 'N/A')}</div>
                            <div class="medicine-remaining ${remainingClass}">
                                <span class="remaining-label">Remaining:</span>
                                <span class="remaining-value">${remainingDisplay}</span>
                            </div>
                        </div>
                    `;
                    
                    prescriptionContainer.appendChild(medicineItem);
                });
            })
            .catch(err => {
                console.error('Failed to fetch current medications:', err);
                if (prescriptionContainer) {
                    prescriptionContainer.innerHTML = '<p class="error-message">Error loading medications.</p>';
                }
            });
    }
    
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Fetch recent prescriptions
    if (recentPrescriptionsList) {
        fetch('../../controller/get-prescription-history.php', { credentials: 'same-origin' })
            .then(res => {
                if (res.status === 401) {
                    recentPrescriptionsList.innerHTML = '<p class="error">Please log in to view prescriptions.</p>';
                    return null;
                }
                if (!res.ok) {
                    throw new Error(`Request failed: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data === null) return;
                
                recentPrescriptionsList.innerHTML = '';
                
                if (!Array.isArray(data) || data.length === 0) {
                    recentPrescriptionsList.innerHTML = '<p class="no-data">No prescriptions found.</p>';
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
                            <div class="prescription-doctor">Dr. ${item.doctorFirstName || ''} ${item.doctorLastName || ''}</div>
                            <div class="prescription-expiry">Expires: ${formatDate(item.dateExpiry)}</div>
                        </div>
                    `;
                    
                    prescriptionItem.style.cursor = 'pointer';
                    prescriptionItem.addEventListener('click', () => {
                        window.location.href = './prescription-details.php';
                    });
                    
                    recentPrescriptionsList.appendChild(prescriptionItem);
                });
            })
            .catch(err => {
                console.error('Failed to fetch prescriptions:', err);
                recentPrescriptionsList.innerHTML = '<p class="error">Error loading prescriptions. Please try again.</p>';
            });
    }
});