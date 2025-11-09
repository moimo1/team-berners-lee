document.addEventListener('DOMContentLoaded', () => {
    const clientNameElement = document.getElementById('client-name');
    const medicineList = document.getElementById('medicine-list');
    const recentPrescriptionsList = document.getElementById('recent-prescriptions-list');

    // Helper to escape HTML for safe display
    const escapeHtml = (text) => {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    // Helper to format dates
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'N/A';
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (e) {
            return 'N/A';
        }
    };

    // Helper to determine remaining class based on amount
    const getRemainingClass = (remainingAmount) => {
        if (remainingAmount === null || remainingAmount === undefined) {
            return 'remaining-high'; // Unlimited
        }
        const amount = parseInt(remainingAmount, 10);
        if (isNaN(amount)) return 'remaining-medium';
        if (amount > 10) return 'remaining-high';
        if (amount > 0) return 'remaining-medium';
        return 'remaining-low';
    };

    // Fetch client name and current medications
    if (clientNameElement || medicineList) {
        fetch('../../controller/get-prescription.php', { credentials: 'same-origin' })
            .then(async res => {
                if (res.status === 401) {
                    if (clientNameElement) clientNameElement.textContent = 'Welcome, Client!';
                    if (medicineList) medicineList.innerHTML = '<p class="no-medications">Please log in to view medications.</p>';
                    return null;
                }
                if (!res.ok) {
                    const text = await res.text().catch(() => '');
                    throw new Error(`Request failed (${res.status}): ${text}`);
                }
                return res.json();
            })
            .then(data => {
                if (data === null) return;
                
                if (data && Array.isArray(data) && data.length > 0) {
                    const firstItem = data[0];
                    
                    // Set client name
                    if (clientNameElement) {
                        const clientName = (firstItem.clientFirstName || '') + ' ' + (firstItem.clientLastName || '');
                        clientNameElement.textContent = `Welcome, ${clientName.trim() || 'Client'}!`;
                    }

                    // Populate current medications
                    if (medicineList) {
                        medicineList.innerHTML = '';
                        data.slice(0, 5).forEach(item => {
                            const div = document.createElement('div');
                            div.className = 'medicine-item';
                            
                            const name = escapeHtml(item.genericName || 'Unknown Medicine');
                            const brand = item.brand && item.brand.trim() 
                                ? `<span class="medicine-brand">${escapeHtml(item.brand)}</span>` 
                                : '';
                            const dosage = item.dosage ? escapeHtml(item.dosage) : 'N/A';
                            
                            const remainingAmount = item.remainingAmount;
                            const remainingDisplay = remainingAmount === null || remainingAmount === undefined 
                                ? 'Unlimited' 
                                : remainingAmount.toString();
                            const remainingClass = getRemainingClass(remainingAmount);
                            
                            div.innerHTML = `
                                <div>
                                    <div class="medicine-name">${name}</div>
                                    ${brand ? `<div class="medicine-brand">${brand}</div>` : ''}
                                </div>
                                <div class="medicine-info">
                                    <div class="medicine-dosage">${dosage}</div>
                                    <div class="medicine-remaining ${remainingClass}">
                                        <span class="remaining-label">Remaining</span>
                                        <span class="remaining-value">${remainingDisplay}</span>
                                    </div>
                                </div>
                            `;
                            medicineList.appendChild(div);
                        });
                    }
                } else {
                    if (clientNameElement) clientNameElement.textContent = 'Welcome, Client!';
                    if (medicineList) medicineList.innerHTML = '<p class="no-medications">No current medications found.</p>';
                }
            })
            .catch(err => {
                console.error('Error loading current medications:', err);
                if (clientNameElement) clientNameElement.textContent = 'Welcome, Client!';
                if (medicineList) medicineList.innerHTML = '<p class="error-message">Error loading medications. Please try again later.</p>';
            });
    }

    // Fetch recent prescriptions
    if (recentPrescriptionsList) {
        fetch('../../controller/get-prescription-history.php', { credentials: 'same-origin' })
            .then(async res => {
                if (res.status === 401) {
                    recentPrescriptionsList.innerHTML = '<p class="error">Please log in to view prescriptions.</p>';
                    return null;
                }
                if (!res.ok) {
                    const text = await res.text().catch(() => '');
                    throw new Error(`Request failed (${res.status}): ${text}`);
                }
                return res.json();
            })
            .then(data => {
                if (data === null) return;
                
                recentPrescriptionsList.innerHTML = '';
                if (!Array.isArray(data) || data.length === 0) {
                    recentPrescriptionsList.innerHTML = '<p class="no-data">No recent prescriptions found.</p>';
                    return;
                }
                
                data.slice(0, 5).forEach(p => {
                    const item = document.createElement('div');
                    item.className = 'prescription-item';

                    const dateGivenStr = formatDate(p.dateGiven);
                    const dateExpiryStr = formatDate(p.dateExpiry);
                    const doctorName = escapeHtml(((p.doctorFirstName || '') + ' ' + (p.doctorLastName || '')).trim());

                    item.innerHTML = `
                        <div class="prescription-date">${dateGivenStr}</div>
                        <div class="prescription-info">
                            <div class="prescription-doctor">Dr. ${doctorName || 'Unknown'}</div>
                            <div class="prescription-expiry">Expires: ${dateExpiryStr}</div>
                        </div>
                    `;
                    recentPrescriptionsList.appendChild(item);
                });
            })
            .catch(err => {
                console.error('Error loading recent prescriptions:', err);
                recentPrescriptionsList.innerHTML = '<p class="error">Error loading prescriptions. Please try again later.</p>';
            });
    }
});