let allPrescriptions = [];
let activePrescriptions = [];
let historyPrescriptions = [];
let currentPrescriptionDetails = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Pharmacist Client List Loaded');

    loadAllPrescriptions();
    const searchInput = document.getElementById('searchbar');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            handleSearch(e.target.value);
        });
    }

    setupTabs();
    setupHistoryFilter();

    setupModalClosers();
});

async function loadAllPrescriptions() {
    const listContainer = document.getElementById('prescription-table-body');

    try {
        const response = await fetch('../../controller/get-all-prescriptions.php', { credentials: 'include' });

        if (response.status === 401) {
            listContainer.innerHTML = '<tr><td colspan="3" class="error-text">Please log in to view prescriptions.</td></tr>';
            return;
        }

        const data = await response.json();

        allPrescriptions = Array.isArray(data) ? data : [];
        classifyPrescriptions();
        renderTable(activePrescriptions);
        // Initialize history view (default filter = all)
        renderHistoryTable(getFilteredHistory('all'));

    } catch (error) {
        console.error('Error loading data:', error);
        listContainer.innerHTML = '<tr><td colspan="3" class="error-text">Error loading data.</td></tr>';
    }
}

function classifyPrescriptions() {
    activePrescriptions = [];
    historyPrescriptions = [];

    const nowActive = [];
    const nowHistory = [];

    (allPrescriptions || []).forEach(item => {
        const isExpired = Number(item.isExpired) === 1;
        const isFullyDispensed = Number(item.isFullyDispensed) === 1;

        // History if expired or fully dispensed
        const isHistory = isExpired || isFullyDispensed;

        if (isHistory) {
            nowHistory.push({
                ...item,
                isExpired,
                isFullyDispensed
            });
        } else {
            nowActive.push({
                ...item,
                isExpired,
                isFullyDispensed
            });
        }
    });

    activePrescriptions = nowActive;
    historyPrescriptions = nowHistory;
}

function renderTable(list) {
    const container = document.getElementById('prescription-table-body');
    container.innerHTML = '';

    if (list.length === 0) {
        container.innerHTML = '<tr><td colspan="3" class="muted-text">No prescriptions found.</td></tr>';
        return;
    }

    list.forEach(item => {
        const tr = document.createElement('tr');

        tr.style.cursor = 'pointer';
        tr.onclick = () => openDetailsModal(item.prescID, false);

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
        renderTable(activePrescriptions);
        return;
    }

    const filtered = activePrescriptions.filter(item => {
        const fullName = (item.clientFirstName + ' ' + item.clientLastName).toLowerCase();
        const id = String(item.prescID);

        return fullName.includes(lowerQuery) || id.includes(lowerQuery);
    });

    renderTable(filtered);
}

async function openDetailsModal(prescID, isHistory = false) {
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

        currentPrescriptionDetails = { ...data, isHistory };
        renderDetailsContent(currentPrescriptionDetails, body);

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
            const isClickable = !data.isHistory && (remaining === 'Unlimited' || remaining > 0);
            const clickAttr = isClickable
                ? `onclick="openPurchaseModal('${med.medID}', '${escapeHtml(med.medicineName || '')}', ${med.amountRemaining}, '${data.prescID}')"`
                : '';

            medicinesHtml += `
                <tr class="${isClickable ? 'clickable-medicine' : 'disabled-medicine'}" ${clickAttr}>
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

function setupTabs() {
    const activeTabBtn = document.getElementById('tab-active-prescriptions');
    const historyTabBtn = document.getElementById('tab-history');
    const activeSection = document.getElementById('active-prescriptions-section');
    const historySection = document.getElementById('history-prescriptions-section');

    if (!activeTabBtn || !historyTabBtn || !activeSection || !historySection) {
        return;
    }

    const activateActive = () => {
        activeTabBtn.classList.add('btn-primary');
        activeTabBtn.classList.remove('btn-secondary');
        historyTabBtn.classList.add('btn-secondary');
        historyTabBtn.classList.remove('btn-primary');

        activeSection.style.display = '';
        historySection.style.display = 'none';
    };

    const activateHistory = () => {
        activeTabBtn.classList.add('btn-secondary');
        activeTabBtn.classList.remove('btn-primary');
        historyTabBtn.classList.add('btn-primary');
        historyTabBtn.classList.remove('btn-secondary');

        activeSection.style.display = 'none';
        historySection.style.display = '';

        // Ensure history table is rendered with current filter
        const filterSelect = document.getElementById('history-filter');
        const value = filterSelect ? filterSelect.value : 'all';
        renderHistoryTable(getFilteredHistory(value));
    };

    activeTabBtn.addEventListener('click', activateActive);
    historyTabBtn.addEventListener('click', activateHistory);

    // Default: Active tab
    activateActive();
}

function setupHistoryFilter() {
    const filterSelect = document.getElementById('history-filter');
    if (!filterSelect) return;

    filterSelect.addEventListener('change', () => {
        const value = filterSelect.value || 'all';
        renderHistoryTable(getFilteredHistory(value));
    });
}

function getFilteredHistory(filterValue) {
    const value = (filterValue || 'all');

    if (!Array.isArray(historyPrescriptions) || historyPrescriptions.length === 0) {
        return [];
    }

    if (value === 'expired') {
        return historyPrescriptions.filter(item => Number(item.isExpired) === 1);
    }
    if (value === 'fully-dispensed') {
        return historyPrescriptions.filter(item => Number(item.isFullyDispensed) === 1);
    }

    // Default: all history (expired OR fully dispensed)
    return historyPrescriptions;
}

function renderHistoryTable(list) {
    const container = document.getElementById('history-table-body');
    if (!container) return;

    container.innerHTML = '';

    if (!list || list.length === 0) {
        container.innerHTML = '<tr><td colspan="5" class="muted-text" style="text-align:center; padding:24px;">No history prescriptions found.</td></tr>';
        return;
    }

    list.forEach(item => {
        const tr = document.createElement('tr');
        tr.style.cursor = 'pointer';
        tr.onclick = () => openDetailsModal(item.prescID, true);

        let statusLabel = '';
        const isExpired = Number(item.isExpired) === 1;
        const isFullyDispensed = Number(item.isFullyDispensed) === 1;

        if (isExpired && isFullyDispensed) {
            statusLabel = 'Expired & Fully Dispensed';
        } else if (isExpired) {
            statusLabel = 'Expired';
        } else if (isFullyDispensed) {
            statusLabel = 'Fully Dispensed';
        } else {
            statusLabel = '';
        }

        tr.innerHTML = `
            <td>#${item.prescID}</td>
            <td>${escapeHtml(item.clientFirstName)} ${escapeHtml(item.clientLastName)}</td>
            <td>${formatDate(item.dateGiven)}</td>
            <td>${formatDate(item.dateExpiry)}</td>
            <td>${escapeHtml(statusLabel)}</td>
        `;

        container.appendChild(tr);
    });
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

