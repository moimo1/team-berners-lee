// ==========================================
// 1. GLOBAL VARIABLES
// ==========================================
let allPrescriptions = [];          // Stores raw data
let currentPrescriptionDetails = null; // Stores details of the currently viewed prescription


// ==========================================
// 2. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Pharmacist Client List Loaded');

    // 1. Load Data
    loadAllPrescriptions();

    // 2. Setup Search Bar
    const searchInput = document.getElementById('searchbar');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            handleSearch(e.target.value);
        });
    }

    // 3. Setup Modal Close Buttons (Global)
    setupModalClosers();
});


// ==========================================
// 3. DATA LOADING
// ==========================================
async function loadAllPrescriptions() {
    const listContainer = document.getElementById('prescription-table-body');

    try {
        const response = await fetch('../../controller/get-all-prescriptions.php', { credentials: 'same-origin' });

        // Handle "Not Logged In"
        if (response.status === 401) {
            listContainer.innerHTML = '<tr><td colspan="3" class="error-text">Please log in to view prescriptions.</td></tr>';
            return;
        }

        const data = await response.json();

        // Save to global variable
        allPrescriptions = data || [];

        // Render to screen
        renderTable(allPrescriptions);

    } catch (error) {
        console.error('Error loading data:', error);
        listContainer.innerHTML = '<tr><td colspan="3" class="error-text">Error loading data.</td></tr>';
    }
}


// ==========================================
// 4. RENDERING & SEARCH
// ==========================================
function renderTable(list) {
    const container = document.getElementById('prescription-table-body');
    container.innerHTML = ''; // Clear old rows

    if (list.length === 0) {
        container.innerHTML = '<tr><td colspan="3" class="muted-text">No prescriptions found.</td></tr>';
        return;
    }

    list.forEach(item => {
        const tr = document.createElement('tr');

        // Make the whole row clickable
        tr.style.cursor = 'pointer';
        tr.onclick = () => openDetailsModal(item.prescID);

        tr.innerHTML = `
            <td>#${item.prescID}</td>
            <td>${escapeHtml(item.clientFirstName)} ${escapeHtml(item.clientLastName)}</td>
            <td>${formatDate(item.dateGiven)}</td>
            <td>${formatDate(item.dateExpiry)}</td>
        `;

        container.appendChild(tr);
    });
}

function handleSearch(query) {
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) {
        renderTable(allPrescriptions); // Show all if empty
        return;
    }

    const filtered = allPrescriptions.filter(item => {
        const fullName = (item.clientFirstName + ' ' + item.clientLastName).toLowerCase();
        const id = String(item.prescID);

        return fullName.includes(lowerQuery) || id.includes(lowerQuery);
    });

    renderTable(filtered);
}


// ==========================================
// 5. DETAILS MODAL LOGIC
// ==========================================
async function openDetailsModal(prescID) {
    const modal = document.getElementById('prescription-details-modal');
    const body = document.getElementById('prescription-details-body');

    // Show modal and Loading message
    modal.style.display = 'block';
    body.innerHTML = '<p>Loading details...</p>';

    try {
        const response = await fetch(`../../controller/get-prescription-details.php?prescID=${prescID}`, { credentials: 'same-origin' });
        const data = await response.json();

        if (data.error) {
            body.innerHTML = `<p class="error-text">${data.error}</p>`;
            return;
        }

        // Save for later (e.g., if we need to refresh)
        currentPrescriptionDetails = data;

        // Render the details
        renderDetailsContent(data, body);

    } catch (error) {
        console.error(error);
        body.innerHTML = '<p class="error-text">Failed to load details.</p>';
    }
}

function renderDetailsContent(data, container) {
    // 1. Patient Info Section
    const infoHtml = `
        <div class="prescription-details-section">
            <h4>Patient Information</h4>
            <p><strong>Name:</strong> ${escapeHtml(data.clientFirstName)} ${escapeHtml(data.clientLastName)}</p>
            <p><strong>Date Given:</strong> ${formatDate(data.dateGiven)}</p>
            <p><strong>Expires:</strong> ${formatDate(data.dateExpiry)}</p>
        </div>
    `;

    // 2. Medicines List Section
    let medicinesHtml = '<div class="medications-section"><h4>Medications</h4>';

    if (!data.medicines || data.medicines.length === 0) {
        medicinesHtml += '<p>No medicines in this prescription.</p>';
    } else {
        medicinesHtml += `
            <table class="table">
                <thead><tr> <th>Medicine</th> <th>Dosage</th> <th>Remaining</th> </tr></thead>
                <tbody>
        `;

        data.medicines.forEach(med => {
            const remaining = med.amountRemaining === null ? 'Unlimited' : med.amountRemaining;
            const isClickable = (remaining === 'Unlimited' || remaining > 0);

            // We attach the data directly to the row element for easy access
            medicinesHtml += `
                <tr class="${isClickable ? 'clickable-medicine' : 'disabled-medicine'}" 
                    onclick="if(${isClickable}) openPurchaseModal(${med.medID}, '${escapeHtml(med.medicineName || '')}', ${med.amountRemaining}, ${data.prescID})">
                    
                    <td>${escapeHtml(med.medicineName || 'Unknown')}</td>
                    <td>${escapeHtml(med.dosage || 'N/A')}</td>
                    <td>${remaining}</td>
                </tr>
            `;
        });

        medicinesHtml += '</tbody></table>';
    }
    medicinesHtml += '</div>';

    container.innerHTML = infoHtml + medicinesHtml;
}


// ==========================================
// 6. PURCHASE MODAL LOGIC
// ==========================================
function openPurchaseModal(medID, medName, remaining, prescID) {
    const modal = document.getElementById('purchase-modal');

    // Fill the visuals
    document.getElementById('medicine-name-display').value = medName;
    document.getElementById('remaining-amount-display').value = (remaining === null ? 'Unlimited' : remaining);

    // Fill hidden inputs for the form
    document.getElementById('purchase-med-id').value = medID;
    document.getElementById('purchase-presc-id').value = prescID;

    // Reset inputs
    const amountInput = document.getElementById('purchase-amount');
    amountInput.value = '';
    amountInput.max = (remaining === null ? '' : remaining); // Set max HTML attribute

    // Setup the confirm button logic
    const confirmBtn = document.getElementById('confirm-purchase-btn');

    // REMOVE old listeners to prevent duplicates (cloning trick)
    const newBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);

    newBtn.addEventListener('click', () => {
        submitPurchase(medID, prescID, amountInput.value, remaining);
    });

    modal.style.display = 'block';
}

async function submitPurchase(medID, prescID, amount, maxLimit) {
    const errorMsg = document.getElementById('amount-error');
    const modal = document.getElementById('purchase-modal');

    // Validation
    const amountNum = parseInt(amount);
    if (!amount || amountNum <= 0) {
        errorMsg.textContent = 'Please enter a valid amount.';
        errorMsg.style.display = 'block';
        return;
    }
    if (maxLimit !== null && amountNum > maxLimit) {
        errorMsg.textContent = 'Not enough stock remaining.';
        errorMsg.style.display = 'block';
        return;
    }

    try {
        const formData = new FormData();
        formData.append('prescID', prescID);
        formData.append('medID', medID);
        formData.append('amount', amountNum);

        const response = await fetch('../../controller/update-prescription-amount.php', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin'
        });

        const result = await response.json();

        if (result.success) {
            alert('Purchase successful!');
            modal.style.display = 'none'; // Close purchase modal
            openDetailsModal(prescID);    // Refresh the details view
        } else {
            errorMsg.textContent = result.error || 'Purchase failed.';
            errorMsg.style.display = 'block';
        }

    } catch (error) {
        console.error(error);
        alert('Server connection error.');
    }
}


// ==========================================
// 7. HELPER FUNCTIONS
// ==========================================
function setupModalClosers() {
    // Close buttons (x)
    document.querySelectorAll('.close-btn, .purchase-close-btn, #cancel-purchase-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Find the closest parent modal and hide it
            const modal = e.target.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });

    // Validating Purchase Input Real-time
    const amountInput = document.getElementById('purchase-amount');
    if (amountInput) {
        amountInput.addEventListener('input', () => {
            document.getElementById('amount-error').style.display = 'none';
        });
    }
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return isNaN(d) ? 'N/A' : d.toLocaleDateString('en-US', { dateStyle: 'medium' });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.innerText = text; // innerText handles escaping automatically
    return div.innerHTML;
}


