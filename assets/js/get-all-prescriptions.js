document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.querySelector('#prescription-table-body');
    const searchInput = document.querySelector('#searchbar');
    let allPrescriptions = [];

    // Fetch all prescriptions initially
    fetch('../../controller/get-all-prescriptions.php', { credentials: 'same-origin' })
        .then(res => res.json())
        .then(data => {
            allPrescriptions = data;
            renderPrescriptions(allPrescriptions.slice(0, 10)); // show initial top 10
        })
        .catch(err => console.error('Failed to fetch prescriptions:', err));

    // Live search as the user types
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();

        if (query === '') {
            renderPrescriptions(allPrescriptions.slice(0, 10));
            return;
        }

        // Show only results where the full name starts with the query
        const filtered = allPrescriptions.filter(item => {
            const first = item.clientFirstName?.toLowerCase() ?? '';
            const last = item.clientLastName?.toLowerCase() ?? '';
            const fullName = `${first} ${last}`.trim();
            return (
                fullName.startsWith(query) ||
                first.startsWith(query) ||
                last.startsWith(query)
            );
        });

        renderPrescriptions(filtered.slice(0, 10));
    });
});

function renderPrescriptions(prescriptions) {
    const listContainer = document.querySelector('#prescription-table-body');
    listContainer.innerHTML = '';

    if (prescriptions.length === 0) {
        listContainer.innerHTML = '<tr><td colspan="4">No prescriptions found.</td></tr>';
        return;
    }

    prescriptions.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.prescID ?? ''}</td>
            <td>${item.clientFirstName ?? ''} ${item.clientLastName ?? ''}</td>
            <td>${item.dateGiven ?? ''}</td>
            <td>${item.status ?? ''}</td>
        `;
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => rowClicked(item.prescID));
        listContainer.appendChild(row);
    });
}

function rowClicked(prescID) {
    fetch(`../../controller/get-prescription-details.php?prescID=${prescID}`, { credentials: 'same-origin' })
        .then(res => res.json())
        .then(data => showPrescriptionDetails(data))
        .catch(err => console.error('Failed to fetch prescription details:', err));
}

function showPrescriptionDetails(data) {
    const modal = document.getElementById('prescriptionModal');
    const clientName = document.getElementById('client-name');
    const detailsBody = document.getElementById('details-body');

    clientName.textContent = `${data.clientFirstName ?? ''} ${data.clientLastName ?? ''}`;
    detailsBody.innerHTML = '';

    if (Array.isArray(data.medicines) && data.medicines.length > 0) {
        data.medicines.forEach(med => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${med.medicineName ?? ''}</td>
                <td>${med.dosage ?? ''}</td>
                <td>${med.amountRemaining ?? ''}</td>
            `;
            detailsBody.appendChild(row);
        });
    } else {
        detailsBody.innerHTML = `<tr><td colspan="3">No medicines found.</td></tr>`;
    }

    modal.style.display = 'block';
}

document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('prescriptionModal').style.display = 'none';
});

window.addEventListener('click', (e) => {
    const modal = document.getElementById('prescriptionModal');
    if (e.target === modal) modal.style.display = 'none';
});
