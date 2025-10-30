document.addEventListener('DOMContentLoaded', () => {
    listContainer = document.querySelector('#prescription-history-tbody');

    fetch('../controller/get-prescription-history.php', { credentials: 'same-origin' })
    .then(res => {
        return res.json();
    })
    .then(data => {
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.firstName ?? ''} ${item.lastName ?? ''}</td>
                <td>${item.dateGiven ?? ''}</td>
                <td>${item.dateExpiry ?? ''}</td>
            `;
            listContainer.appendChild(row);
        });
    }).catch(err => {
        console.error('Failed to fetch prescription history:', err);
    });
});