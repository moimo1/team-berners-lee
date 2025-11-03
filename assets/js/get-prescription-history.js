document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.querySelector('#prescription-history-tbody');
    if (!listContainer) return;

    fetch('../../controller/get-prescription-history.php', { credentials: 'same-origin' })
        .then(res => res.json())
        .then(data => {
            console.log('Fetched data:', data);
            renderPrescriptionList(data, listContainer);
        })
        .catch(err => {
            console.error('Failed to fetch prescription history:', err);
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
    if (!data || data.length === 0) {
        container.innerHTML = `<tr><td colspan="5" style="text-align:center; color:gray;">No prescriptions found</td></tr>`;
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
    dateGiven = dateToWords(item.dateGiven);
    dateExpiry = dateToWords(item.dateExpiry);
    switch (USER_ROLE) {
        case 'client':
            html = `
                <td>${dateGiven}</td>
                <td>${dateExpiry}</td>
                <td>Dr. ${item.doctorFirstName ?? ''} ${item.doctorLastName ?? ''}</td>
            `;
            break;

        case 'doctor':
            html = `
                <td>${item.dateGiven ?? ''}</td>
                <td>${item.dateExpiry ?? ''}</td>
                <td>${item.clientFirstName ?? ''} ${item.clientLastName ?? ''}</td>
            `;
            break;

        case 'pharmacist': // ✅ Pharmacist view
            html = `
                <td>${item.prescID ?? ''}</td>
                <td>${item.clientFirstName ?? ''} ${item.clientLastName ?? ''}</td>
                <td>${item.dateGiven ?? ''}</td>
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
        .then(res => res.json())
        .then(data => showPrescriptionDetails(data))
        .catch(err => console.error('Failed to fetch prescription details:', err));
}

function showPrescriptionDetails(data) {
    const detailsBody = document.getElementById('details-body');
    if (!detailsBody) return;

    detailsBody.innerHTML = '';

    data.forEach(detail => {
        detailsBody.innerHTML += getDetailContentByRole(detail) + '<hr>';
    });

    const modal = document.getElementById('details-modal');
    if (modal) {
        modal.style.display = 'block';

        const closeBtn = modal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.onclick = () => {
                modal.style.display = 'none';
                detailsBody.innerHTML = '';
            };
        }
    }
}

function getDetailContentByRole(detail) {
    let html = `
        <p><strong>Medicine:</strong> ${detail.genericName ?? ''}</p>
        <p><strong>Dosage:</strong> ${detail.dosage ?? ''}</p>
        <p><strong>Amount Remaining:</strong> ${detail.remainingAmount ?? ''}</p>
    `;

    if (USER_ROLE === 'doctor') {
        html += `<p><strong>Description:</strong> ${detail.description ?? ''}</p>`;
    } else if (USER_ROLE === 'client') {
        html += `<p><strong>Instructions:</strong> ${detail.description ?? ''}</p>`;
    } else if (USER_ROLE === 'pharmacist') {
        html += `
            <p><strong>Description:</strong> ${detail.description ?? ''}</p>
            <p><strong>Available Stock:</strong> ${detail.availableStock ?? 'N/A'}</p>
            <p><strong>Last Dispensed:</strong> ${detail.lastDispensed ?? 'Not yet dispensed'}</p>
        `;
    }

    return html;
}

function dateToWords(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}
