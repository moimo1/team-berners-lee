document.addEventListener('DOMContentLoaded', () => {
    listContainer = document.querySelector('#prescription-history-tbody');

    fetch('../../controller/get-prescription-history.php', { credentials: 'same-origin' })
    .then(res => {
        return res.json();
    })
    .then(data => {
        console.log('Fetched data:', data);
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.dateGiven ?? ''}</td>
                <td>${item.dateExpiry ?? ''}</td>
                <td>${item.doctorFirstName ?? ''} ${item.doctorLastName ?? ''}</td>
            `;

            row.style.cursor = 'pointer';
            row.addEventListener('click', () => rowClicked(item.prescID));
            listContainer.appendChild(row);
        });
    }).catch(err => {
        console.error('Failed to fetch prescription history:', err);
    });
});

function rowClicked(prescID) {
    console.log('Row clicked for prescriptionID:', prescID);
    fetch(`../../controller/get-prescription.php?prescID=${prescID}`, { credentials: 'same-origin' })
    .then(res => res.json())
    .then(data => {
        data.forEach(detail => {
            console.log('Prescription Detail:', detail);

            const detailsBody = document.getElementById('details-body');
            detailsBody.innerHTML += `
                <p>Medicine: ${detail.genericName ?? ''}</p>
                <p>Dosage: ${detail.dosage ?? ''}</p>
                <p>Remaining Amount: ${detail.remainingAmount ?? ''}</p>
                <p>Description: ${detail.description ?? ''}</p>
                <hr>
            `;
        });

        const modal = document.getElementById('details-modal');
        modal.style.display = 'block';
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            document.getElementById('details-body').innerHTML = '';
        };
    }).catch(err => {
        console.error('Failed to fetch prescription details:', err);
    })
}