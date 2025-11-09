document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.querySelector('#prescription-history-tbody');
    if (!listContainer) return;

    // Initial loading message
    listContainer.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:16px; color:#64748b;">Loading prescription history...</td></tr>`;

    fetch('../../controller/get-prescription-history.php', { credentials: 'same-origin' })
        .then(async res => {
            if (res.status === 401) {
                listContainer.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:16px; color:#dc2626;">Please log in to view prescriptions.</td></tr>';
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
            renderPrescriptionList(Array.isArray(data) ? data : [], listContainer);
        })
        .catch(err => {
            console.error('Failed to fetch prescription history:', err);
            listContainer.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:16px; color:#dc2626;">Error loading prescription history. Please try again later.</td></tr>';
        });
});

const createBtn = document.getElementById('create-prescription-btn');
if (createBtn) {
    createBtn.addEventListener('click', function() {
        // placeholder for future functionality
    });
}

function renderPrescriptionList(data, container) {
    container.innerHTML = '';
    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:16px; color:#64748b;">No prescriptions found</td></tr>`;
        return;
    }

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = getRowContentByRole(item);
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => rowClicked(item.prescID));
        container.appendChild(row);
    });
}

function getRowContentByRole(item) {
    const dateGiven = formatDate(item.dateGiven);
    const dateExpiry = formatDate(item.dateExpiry);
    const status = item.status || 'Active'; // Default to 'Active' if status is not set

    // Escape HTML for doctor names
    const doctorName = escapeHtml((item.doctorFirstName || '') + ' ' + (item.doctorLastName || ''));

    let html = '';
    switch (USER_ROLE) {
        case 'client':
            html = `
                <td>${dateGiven}</td>
                <td>${dateExpiry}</td>
                <td>Dr. ${doctorName}</td>
                <td><span class="status-badge ${getStatusClass(status)}">${status}</span></td>
            `;
            break;
        case 'doctor':
            // Assuming doctor view needs client names
            const clientName = escapeHtml((item.clientFirstName || '') + ' ' + (item.clientLastName || ''));
            html = `
                <td>${dateGiven}</td>
                <td>${dateExpiry}</td>
                <td>${clientName}</td>
                <td><span class="status-badge ${getStatusClass(status)}">${status}</span></td>
            `;
            break;
        case 'pharmacist':
            // Assuming pharmacist view needs client names and prescID
            const pharmaClientName = escapeHtml((item.clientFirstName || '') + ' ' + (item.clientLastName || ''));
            html = `
                <td>${escapeHtml(item.prescID || 'N/A')}</td>
                <td>${pharmaClientName}</td>
                <td>${dateGiven}</td>
                <td><span class="status-badge ${getStatusClass(status)}">${status}</span></td>
            `;
            break;
        default:
            html = `<td colspan="4">Unknown role or missing data</td>`;
    }
    return html;
}

function rowClicked(prescID) {
    if (!prescID) return;
    fetch(`../../controller/get-prescription.php?prescID=${encodeURIComponent(prescID)}`, { credentials: 'same-origin' })
        .then(async res => {
            if (res.status === 401) {
                throw new Error('Please log in to view prescription details.');
            }
            if (!res.ok) {
                const text = await res.text().catch(() => '');
                throw new Error(`Request failed (${res.status}): ${text}`);
            }
            return res.json();
        })
        .then(data => showPrescriptionDetails(Array.isArray(data) ? data : []))
        .catch(err => {
            console.error('Failed to fetch prescription details:', err);
            const detailsBody = document.getElementById('details-body');
            if (detailsBody) {
                detailsBody.innerHTML = '<p style="text-align: center; color: #dc2626; padding: 24px;">Error loading prescription details. Please try again later.</p>';
                const modal = document.getElementById('details-modal');
                if (modal) {
                    modal.style.display = 'block';
                }
            }
        });
}

function showPrescriptionDetails(data) {
    const detailsBody = document.getElementById('details-body');
    if (!detailsBody) return;

    detailsBody.innerHTML = '';

    if (!Array.isArray(data) || data.length === 0) {
        detailsBody.innerHTML = '<p style="text-align:center; color:#64748b; padding: 16px;">No prescription details found.</p>';
    } else {
        const first = data[0];
        const header = `
            <div class="details-header">
                <div><strong>Prescription ID:</strong> ${escapeHtml(first.prescID || 'N/A')}</div>
                <div><strong>Date Given:</strong> ${formatDate(first.dateGiven)}</div>
                <div><strong>Expiry Date:</strong> ${formatDate(first.dateExpiry)}</div>
            </div>
        `;
        detailsBody.innerHTML = header;

        data.forEach((detail, idx) => {
            detailsBody.innerHTML += getDetailContentByRole(detail);
            if (idx < data.length - 1) {
                detailsBody.innerHTML += '<hr class="details-sep">';
            }
        });
    }

    const modal = document.getElementById('details-modal');
    if (modal) {
        modal.style.display = 'block';

        const closeBtn = modal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.onclick = (e) => {
                e.stopPropagation();
                modal.style.display = 'none';
                detailsBody.innerHTML = '';
            };
        }

        // Close modal when clicking outside
        modal.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                detailsBody.innerHTML = '';
            }
        };
    }
}

function getDetailContentByRole(detail) {
    const name = escapeHtml(detail.genericName || 'N/A');
    const dosage = escapeHtml(detail.dosage || 'N/A');
    const remaining = (detail.remainingAmount !== null && detail.remainingAmount !== undefined) ? String(detail.remainingAmount) : 'N/A';
    const desc = escapeHtml(detail.description || '');

    return `
        <div class="detail-card">
            <div class="detail-main">
                <div class="detail-row"><strong>Medicine:</strong> ${name}</div>
                <div class="detail-row"><strong>Dosage:</strong> ${dosage}</div>
                <div class="detail-row"><strong>Amount Remaining:</strong> ${remaining}</div>
            </div>
            ${desc ? `<div class="detail-desc"><strong>Instructions:</strong> ${desc}</div>` : ''}
        </div>
    `;
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
        return 'N/A';
    }
}

function getStatusClass(status) {
    const s = (status || '').toLowerCase();
    if (s === 'expired') return 'is-expired';
    if (s === 'pending') return 'is-pending';
    return 'is-active';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}