document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.querySelector('#prescription-table-body');
    if (!listContainer) return;

    fetch('../../controller/get-all-prescriptions.php', { credentials: 'same-origin' })
        .then(res => res.json())
        .then(data => {
            console.log('Fetched data:', data);
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.prescID ?? ''}</td>
                    <td>${item.clientFirstName ?? ''} ${item.clientLastName ?? ''}</td>
                    <td>${item.dateGiven ?? ''}</td>
                    <td>${item.status ?? ''}</td>
                `;
                row.style.cursor = 'pointer';
                row.addEventListener('click', () => {
                    console.log('Row clicked for prescriptionID:', item.prescID);
                    rowClicked(item.prescID);
                });
                listContainer.appendChild(row);
            });
        })
        .catch(err => {
            console.error('Failed to fetch all prescriptions:', err);
        });
});

function rowClicked(prescID) {
    console.log('Row clicked for prescriptionID:', prescID);
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

    // Show modal
    modal.style.display = 'block';
}

// Close modal when clicking X
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('prescriptionModal').style.display = 'none';
});

// Optional: close when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('prescriptionModal');
    if (e.target === modal) modal.style.display = 'none';
});
