document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.querySelector('#prescription-history-tbody');
    if (!listContainer) return;

    fetch('../../controller/get-prescription-history.php', { credentials: 'same-origin' })
        .then(async res => {
            if (res.status === 401) {
                listContainer.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 24px; color: #dc2626;">Please log in to view prescriptions.</td></tr>';
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
            console.log('Fetched data:', data);
            renderPrescriptionList(data, listContainer);
        })
        .catch(err => {
            console.error('Failed to fetch prescription history:', err);
            listContainer.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 24px; color: #dc2626;">Error loading prescription history. Please try again later.</td></tr>';
        });
});

const createBtn = document.getElementById('create-prescription-btn');
if (createBtn) {
    createBtn.addEventListener('click', function() {
        // placeholder for future functionality
    });
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
        return dateString;
    }
}

function renderPrescriptionList(data, container) {
    container.innerHTML = ''; 
    if (!data || data.length === 0) {
        container.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 24px; color: #64748b;">No prescriptions found</td></tr>`;
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
    let html = '';

    switch (USER_ROLE) {
        case 'client':
            html = `
                <td>${formatDate(item.dateGiven)}</td>
                <td>${formatDate(item.dateExpiry)}</td>
                <td>Dr. ${item.doctorFirstName ?? ''} ${item.doctorLastName ?? ''}</td>
                <td>${item.status ?? 'Active'}</td>
            `;
            break;

        case 'doctor':
            html = `
                <td>${formatDate(item.dateGiven)}</td>
                <td>${formatDate(item.dateExpiry)}</td>
                <td>${item.clientFirstName ?? ''} ${item.clientLastName ?? ''}</td>
                <td>${item.status ?? 'Active'}</td>
            `;
            break;

        case 'pharmacist':
            html = `
                <td>${item.prescID ?? ''}</td>
                <td>${item.clientFirstName ?? ''} ${item.clientLastName ?? ''}</td>
                <td>${formatDate(item.dateGiven)}</td>
                <td>${item.status ?? 'Pending'}</td>
            `;
            break;

        default:
            html = `<td colspan="4">Unknown role or missing data</td>`;
    }

    return html;
}

function rowClicked(prescID) {
    console.log('Row clicked for prescriptionID:', prescID);

    fetch(`../../controller/get-prescription.php?prescID=${prescID}`, { credentials: 'same-origin' })
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
        .then(data => showPrescriptionDetails(data))
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
        detailsBody.innerHTML = '<p style="text-align: center; color: #64748b; padding: 24px;">No prescription details found.</p>';
    } else {
        // Get prescription header info from first item
        const firstItem = data[0];
        const prescID = firstItem.prescID || 'N/A';
        const dateGiven = formatDate(firstItem.dateGiven);
        const dateExpiry = formatDate(firstItem.dateExpiry);
        
        detailsBody.innerHTML = `
            <div class="prescription-header" style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #e2e8f0;">
                <p style="margin: 0 0 8px 0;"><strong>Prescription ID:</strong> ${prescID}</p>
                <p style="margin: 0 0 8px 0;"><strong>Date Given:</strong> ${dateGiven}</p>
                <p style="margin: 0;"><strong>Expiry Date:</strong> ${dateExpiry}</p>
            </div>
            <h4 style="margin: 0 0 16px 0; font-size: 16px; color: #0f172a;">Medications:</h4>
        `;

        data.forEach((detail, index) => {
            detailsBody.innerHTML += getDetailContentByRole(detail);
            if (index < data.length - 1) {
                detailsBody.innerHTML += '<hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0;">';
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
    const escapeHtml = (text) => {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    let html = `
        <div style="padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
            <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #0f172a;">
                ${escapeHtml(detail.genericName || 'N/A')}
                ${detail.brand ? `<span style="font-weight: 400; color: #64748b; font-size: 14px;">(${escapeHtml(detail.brand)})</span>` : ''}
            </p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                    <p style="margin: 0 0 4px 0; font-size: 12px; color: #64748b; font-weight: 500;">Dosage</p>
                    <p style="margin: 0; font-size: 14px; color: #0f172a;">${escapeHtml(detail.dosage || 'N/A')}</p>
                </div>
                <div>
                    <p style="margin: 0 0 4px 0; font-size: 12px; color: #64748b; font-weight: 500;">Amount Remaining</p>
                    <p style="margin: 0; font-size: 14px; color: #0f172a;">${detail.remainingAmount !== null && detail.remainingAmount !== undefined ? detail.remainingAmount : 'N/A'}</p>
                </div>
            </div>
    `;

    if (detail.description) {
        html += `
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0 0 4px 0; font-size: 12px; color: #64748b; font-weight: 500;">
                    ${USER_ROLE === 'doctor' ? 'Description' : 'Instructions'}
                </p>
                <p style="margin: 0; font-size: 14px; color: #0f172a; line-height: 1.5;">${escapeHtml(detail.description)}</p>
            </div>
        `;
    }

    if (USER_ROLE === 'pharmacist') {
        html += `
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0 0 4px 0; font-size: 12px; color: #64748b; font-weight: 500;">Available Stock</p>
                <p style="margin: 0; font-size: 14px; color: #0f172a;">${detail.availableStock ?? 'N/A'}</p>
            </div>
        `;
    }

    html += '</div>';
    return html;
}
