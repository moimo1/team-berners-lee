document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.querySelector('#prescription-history-tbody');

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

button = document.getElementById('create-prescription-btn').addEventListener('click', function() {
    
});

function renderPrescriptionList(data, container) {
    container.innerHTML = ''; 
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = getRowContentByRole(item);
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => rowClicked(item.prescID));
        container.appendChild(row);
    });
}

function getRowContentByRole(item) {
    let base = `
        <td>${item.dateGiven ?? ''}</td>
        <td>${item.dateExpiry ?? ''}</td>
    `;

    switch (USER_ROLE) {
        case 'client':
            base += `<td>Dr. ${item.doctorFirstName ?? ''} ${item.doctorLastName ?? ''}</td>`;
            break;
        case 'doctor':
            base += `<td>${item.clientFirstName ?? ''} ${item.clientLastName ?? ''}</td>`;
            break;
        default:
            base += `<td>N/A</td>`;
    }

    return base;
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
    detailsBody.innerHTML = '';

    data.forEach(detail => {
        detailsBody.innerHTML += getDetailContentByRole(detail) + '<hr>';
    });

    const modal = document.getElementById('details-modal');
    modal.style.display = 'block';

    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.onclick = () => {
        modal.style.display = 'none';
        detailsBody.innerHTML = '';
    };
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
    }

    return html;
}
