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
            row.addEventListener('click', () => rowClicked(item.prescriptionID));
            listContainer.appendChild(row);
        });
    }).catch(err => {
        console.error('Failed to fetch prescription history:', err);
    });
});