// 1. WHEN PAGE LOADS
document.addEventListener('DOMContentLoaded', () => {
    console.log('Client dashboard loaded');

    // These are the two main sections we want to fill with data
    const medicineListContainer = document.getElementById('medicine-list'); // Current meds
    const historyListContainer = document.getElementById('recent-prescriptions-list'); // History

    // If the "Current Medications" box exists on this page, load the data
    if (medicineListContainer) {
        loadCurrentMedications(medicineListContainer);
    }

    // If the "Recent Prescriptions" box exists on this page, load the data
    if (historyListContainer) {
        loadPrescriptionHistory(historyListContainer);
    }
});


// 2. LOAD CURRENT MEDICATIONS
async function loadCurrentMedications(container) {
    try {
        // Fetch data from server
        const response = await fetch('../../controller/get-prescription.php', { credentials: 'same-origin' });

        if (!response.ok) {
            throw new Error('Server error: ' + response.status);
        }

        const medicationList = await response.json();

        // Check if list is empty
        if (!Array.isArray(medicationList) || medicationList.length === 0) {
            container.innerHTML = '<p class="no-medications">No current medications.</p>';
            return;
        }

        // Clear existing content
        container.innerHTML = '';

        // Loop through each medicine and create a card
        medicationList.forEach(medicine => {
            // Decide the color and text for "Remaining"
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

            // Create HTML for one item
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

            // Add it to the list
            container.appendChild(itemDiv);
        });

    } catch (error) {
        console.error('Error loading medications:', error);
        container.innerHTML = '<p class="error-message">Error loading medications.</p>';
    }
}


// 3. LOAD RECENT HISTORY
async function loadPrescriptionHistory(container) {
    try {
        const response = await fetch('../../controller/get-prescription-history.php', { credentials: 'same-origin' });

        // Check for "Not Logged In" (401)
        if (response.status === 401) {
            container.innerHTML = '<p class="error">Please log in to view prescriptions.</p>';
            return;
        }

        if (!response.ok) {
            throw new Error('Server error: ' + response.status);
        }

        const historyList = await response.json();

        if (!historyList) return; // Stop if no data at all

        // Clear existing content
        container.innerHTML = '';

        if (!Array.isArray(historyList) || historyList.length === 0) {
            container.innerHTML = '<p class="no-data">No prescriptions found.</p>';
            return;
        }

        // Only show the top 5
        const top5 = historyList.slice(0, 5);

        top5.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'prescription-item';
            itemDiv.style.cursor = 'pointer';

            // Format the dates nicely
            const dateGiven = formatDate(item.dateGiven);
            const dateExpiry = formatDate(item.dateExpiry);

            itemDiv.innerHTML = `
                <div class="prescription-date">${dateGiven}</div>
                <div class="prescription-info">
                    <div class="prescription-doctor">Dr. ${item.doctorFirstName || ''} ${item.doctorLastName || ''}</div>
                    <div class="prescription-expiry">Expires: ${dateExpiry}</div>
                </div>
            `;

            // Make it clickable
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


// 4. HELPER FUNCTIONS

// Makes dates look like "Jan 1, 2023"
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

// Prevents hacking (XSS) by turning special characters into safe text
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
