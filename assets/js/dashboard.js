document.addEventListener('DOMContentLoaded', () => {
    console.log('Client dashboard loaded');

    const medicineListContainer = document.getElementById('medicine-list');
    const historyListContainer = document.getElementById('recent-prescriptions-list');

    if (medicineListContainer) {
        loadCurrentMedications(medicineListContainer);
    }

    if (historyListContainer) {
        loadPrescriptionHistory(historyListContainer);
    }
});


async function loadCurrentMedications(container) {
    try {
        const response = await fetch('../../controller/get-prescription.php', { credentials: 'same-origin' });

        if (!response.ok) {
            throw new Error('Server error: ' + response.status);
        }

        const medicationList = await response.json();

        if (!Array.isArray(medicationList) || medicationList.length === 0) {
            container.innerHTML = '<p class="no-medications">No current medications.</p>';
            return;
        }

        container.innerHTML = '';

        medicationList.forEach(medicine => {
            let remainingText = '';
            let colorClass = '';

            const amount = medicine.remainingAmount;

            if (amount === null || amount === undefined) {
                remainingText = 'Unlimited';
                colorClass = 'remaining-high'; // Green
            } else {
                remainingText = amount;

                if (amount > 10) {
                    colorClass = 'remaining-high'; // Green
                } else if (amount > 0) {
                    colorClass = 'remaining-medium'; // Orange
                } else {
                    colorClass = 'remaining-low'; // Red
                }
            }

            const itemDiv = document.createElement('div');
            itemDiv.className = 'medicine-item';

            itemDiv.innerHTML = `
                <div class="medicine-name">${escapeHtml(medicine.genericName || 'Unknown Medicine')}</div>
                <div class="medicine-info">
                    <div class="medicine-dosage">${escapeHtml(medicine.dosage || 'N/A')}</div>
                    <div class="medicine-remaining ${colorClass}">
                        <span class="remaining-label">Remaining:</span>
                        <span class="remaining-value">${remainingText}</span>
                    </div>
                </div>
            `;

            container.appendChild(itemDiv);
        });

    } catch (error) {
        console.error('Error loading medications:', error);
        container.innerHTML = '<p class="error-message">Error loading medications.</p>';
    }
}


async function loadPrescriptionHistory(container) {
    try {
        const response = await fetch('../../controller/get-prescription-history.php', { credentials: 'same-origin' });

        if (response.status === 401) {
            container.innerHTML = '<p class="error">Please log in to view prescriptions.</p>';
            return;
        }

        if (!response.ok) {
            throw new Error('Server error: ' + response.status);
        }

        const historyList = await response.json();

        if (!historyList) return;

        container.innerHTML = '';

        if (!Array.isArray(historyList) || historyList.length === 0) {
            container.innerHTML = '<p class="no-data">No prescriptions found.</p>';
            return;
        }

        const top5 = historyList.slice(0, 5);

        top5.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'prescription-item';
            itemDiv.style.cursor = 'pointer';

            const dateGiven = formatDate(item.dateGiven);
            const dateExpiry = formatDate(item.dateExpiry);

            itemDiv.innerHTML = `
                <div class="prescription-date">${dateGiven}</div>
                <div class="prescription-info">
                    <div class="prescription-doctor">Dr. ${item.doctorFirstName || ''} ${item.doctorLastName || ''}</div>
                    <div class="prescription-expiry">Expires: ${dateExpiry}</div>
                </div>
            `;

            itemDiv.addEventListener('click', () => {
                window.location.href = './prescription-details.php';
            });

            container.appendChild(itemDiv);
        });

    } catch (error) {
        console.error('Error loading history:', error);
        container.innerHTML = '<p class="error">Error loading prescriptions.</p>';
    }
}



function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date)) return 'N/A';

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
