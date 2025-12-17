let allPrescriptions = [];
let currentPrescriptionDetails = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Pharmacist Client List Loaded');

    // Load data and wire up interactions
    loadAllPrescriptions();

    const searchInput = document.getElementById('searchbar');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            handleSearch(e.target.value);
        });
    }

    const historyFilter = document.getElementById('history-view-filter');
    if (historyFilter) {
        historyFilter.addEventListener('change', () => {
            renderHistoryTable();
        });
    }

    const tabActiveBtn = document.getElementById('tab-active-btn');
    const tabHistoryBtn = document.getElementById('tab-history-btn');
    if (tabActiveBtn && tabHistoryBtn) {
        tabActiveBtn.addEventListener('click', () => switchTab('active'));
        tabHistoryBtn.addEventListener('click', () => switchTab('history'));
    }

    setupModalClosers();
});

async function loadAllPrescriptions() {
    const activeContainer = document.getElementById('prescription-active-tbody');
    const historyContainer = document.getElementById('prescription-history-tbody');

    if (activeContainer) {
        activeContainer.innerHTML = '<tr><td colspan="4" class="muted-text">Loading prescriptions...</td></tr>';
    }
    if (historyContainer) {
        historyContainer.innerHTML = '<tr><td colspan="5" class="muted-text">Loading history...</td></tr>';
    }

    try {
        const response = await fetch('../../controller/get-all-prescriptions.php', { credentials: 'include' });

        if (response.status === 401) {
            if (activeContainer) {
                activeContainer.innerHTML = '<tr><td colspan="4" class="error-text">Please log in to view prescriptions.</td></tr>';
            }
            if (historyContainer) {
                historyContainer.innerHTML = '<tr><td colspan="5" class="error-text">Please log in to view prescriptions.</td></tr>';
            }
            return;
        }

        const data = await response.json();

        allPrescriptions = Array.isArray(data) ? data : [];

        // Initial render: active tab (clean workspace) and matching history
        renderActiveTable();
        renderHistoryTable();

    } catch (error) {
        console.error('Error loading data:', error);
        if (activeContainer) {
            activeContainer.innerHTML = '<tr><td colspan="4" class="error-text">Error loading data.</td></tr>';
        }
        if (historyContainer) {
            historyContainer.innerHTML = '<tr><td colspan="5" class="error-text">Error loading data.</td></tr>';
        }
    }
}

/**
 * Active workspace: only prescriptions that are NOT expired and NOT fully dispensed.
 */
function getActivePrescriptions() {
    return allPrescriptions.filter(item => {
        const isExpired = !!item.isExpired;
        const isFullyDispensed = !!item.isFullyDispensed;
        return !isExpired && !isFullyDispensed;
    });
}

/**
 * History workspace: prescriptions that are expired OR fully dispensed.
 */
function getHistoryPrescriptions() {
    return allPrescriptions.filter(item => {
        const isExpired = !!item.isExpired;
        const isFullyDispensed = !!item.isFullyDispensed;
        return isExpired || isFullyDispensed;
    });
}

function renderActiveTable(listOverride) {
    const container = document.getElementById('prescription-active-tbody');
    if (!container) return;

    const list = Array.isArray(listOverride) ? listOverride : getActivePrescriptions();

    container.innerHTML = '';

    if (list.length === 0) {
        container.innerHTML = '<tr><td colspan="4" class="muted-text">No active prescriptions found.</td></tr>';
        return;
    }

    list.forEach(item => {
        const tr = document.createElement('tr');

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

function renderHistoryTable() {
    const container = document.getElementById('prescription-history-tbody');
    if (!container) return;

    const filterSelect = document.getElementById('history-view-filter');
    const mode = filterSelect ? filterSelect.value : 'all';

    let list = getHistoryPrescriptions();

    if (mode === 'expired') {
        list = list.filter(item => !!item.isExpired);
    } else if (mode === 'fully-dispensed') {
        list = list.filter(item => !!item.isFullyDispensed);
    }

    container.innerHTML = '';

    if (list.length === 0) {
        container.innerHTML = '<tr><td colspan="5" class="muted-text">No prescriptions found for this view.</td></tr>';
        return;
    }

    list.forEach(item => {
        const tr = document.createElement('tr');

        // History is read-only; no click handler for dispensing
        tr.style.cursor = 'default';

        const statusLabel = buildHistoryStatusLabel(item);

        tr.innerHTML = `
            <td>#${item.prescID}</td>
            <td>${escapeHtml(item.clientFirstName)} ${escapeHtml(item.clientLastName)}</td>
            <td>${formatDate(item.dateGiven)}</td>
            <td>${formatDate(item.dateExpiry)}</td>
            <td>${statusLabel}</td>
        `;

        container.appendChild(tr);
    });
}

function buildHistoryStatusLabel(item) {
    const isExpired = !!item.isExpired;
    const isFullyDispensed = !!item.isFullyDispensed;

    if (isExpired && isFullyDispensed) {
        return 'Expired & Fully Dispensed';
    }
    if (isExpired) {
        return 'Expired';
    }
    if (isFullyDispensed) {
        return 'Fully Dispensed';
    }
    return 'Historical';
}

function handleSearch(query) {
    const lowerQuery = query.toLowerCase().trim();

    const baseList = getActivePrescriptions();

    if (!lowerQuery) {
        renderActiveTable(baseList);
        return;
    }

    const filtered = baseList.filter(item => {
        const fullName = (item.clientFirstName + ' ' + item.clientLastName).toLowerCase();
        const id = String(item.prescID);

        return fullName.includes(lowerQuery) || id.includes(lowerQuery);
    });

    renderActiveTable(filtered);
}

async function openDetailsModal(prescID) {
    const modal = document.getElementById('prescription-details-modal');
    const body = document.getElementById('prescription-details-body');

    modal.style.display = 'block';
    body.innerHTML = '<p>Loading details...</p>';

    try {
        const response = await fetch(`../../controller/get-prescription-details.php?prescID=${prescID}`, {
            credentials: 'include',
            cache: 'no-store'
        });
        const data = await response.json();

        if (data.error) {
            body.innerHTML = `<p class="error-text">${data.error}</p>`;
            return;
        }

        currentPrescriptionDetails = data;
        renderDetailsContent(data, body);

    } catch (error) {
        console.error(error);
        body.innerHTML = '<p class="error-text">Failed to load details.</p>';
    }
}

function renderDetailsContent(data, container) {
    const infoHtml = `
        <div class="prescription-details-section">
            <h4>Patient Information</h4>
            <p><strong>Name:</strong> ${escapeHtml(data.clientFirstName)} ${escapeHtml(data.clientLastName)}</p>
            <p><strong>Date Given:</strong> ${formatDate(data.dateGiven)}</p>
            <p><strong>Expires:</strong> ${formatDate(data.dateExpiry)}</p>
        </div>
    `;

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

            medicinesHtml += `
                <tr class="${isClickable ? 'clickable-medicine' : 'disabled-medicine'}" 
                    onclick="if(${isClickable}) openPurchaseModal('${med.medID}', '${escapeHtml(med.medicineName || '')}', ${med.amountRemaining}, '${data.prescID}')">
                    
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

function openPurchaseModal(medID, medName, remaining, prescID) {
    const modal = document.getElementById('purchase-modal');

    document.getElementById('medicine-name-display').value = medName;
    document.getElementById('remaining-amount-display').value = (remaining === null ? 'Unlimited' : remaining);

    document.getElementById('purchase-med-id').value = medID;
    document.getElementById('purchase-presc-id').value = prescID;

    const amountInput = document.getElementById('purchase-amount');
    amountInput.value = '';
    amountInput.max = (remaining === null ? '' : remaining);

    const confirmBtn = document.getElementById('confirm-purchase-btn');

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

    const amountNum = parseInt(amount);
    if (!amount || amountNum <= 0) {
        errorMsg.textContent = 'Please enter a valid amount.';
        errorMsg.style.display = 'block';
        return;
    }
    if (maxLimit !== null && amountNum > maxLimit) {
        errorMsg.textContent = 'Amount is greater than prescribed limit.';
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
            credentials: 'include'
        });

        const result = await response.json();

        if (result.success) {
            alert('Purchase successful!');
            modal.style.display = 'none';
            openDetailsModal(prescID);
        } else {
            errorMsg.textContent = result.error || 'Purchase failed.';
            errorMsg.style.display = 'block';
        }

    } catch (error) {
        console.error(error);
        alert('Server connection error.');
    }
}


function setupModalClosers() {
    document.querySelectorAll('.close-btn, .purchase-close-btn, #cancel-purchase-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });

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
    return isNaN(d) ? 'N/A' : d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

/**
 * Simple tab switching between Active and History
 */
function switchTab(tab) {
    const activePanel = document.getElementById('tab-active');
    const historyPanel = document.getElementById('tab-history');
    const activeBtn = document.getElementById('tab-active-btn');
    const historyBtn = document.getElementById('tab-history-btn');

    if (!activePanel || !historyPanel || !activeBtn || !historyBtn) return;

    const showActive = tab === 'active';

    activePanel.style.display = showActive ? '' : 'none';
    historyPanel.style.display = showActive ? 'none' : '';

    if (showActive) {
        activeBtn.classList.add('active');
        historyBtn.classList.remove('active');
    } else {
        historyBtn.classList.add('active');
        activeBtn.classList.remove('active');
    }
}

