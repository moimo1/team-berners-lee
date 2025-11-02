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