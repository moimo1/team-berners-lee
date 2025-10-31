document.addEventListener('DOMContentLoaded', () => {

    button = document.getElementById('sample');

    // for testing purposes
    button.addEventListener('click', () => {
        let container = document.querySelector('.main-content');

        childContainer = document.createElement('div');
        childContainer.innerHTML = '<p>Hello world.</p>';
        container.appendChild(childContainer);
    });

    const listContainer = document.querySelector('.prescription-list');
    if (!listContainer) return;

    fetch('../../controller/get-prescription.php', { credentials: 'same-origin' })
        .then(async res => {
            if (res.status === 401) {
                listContainer.innerHTML = '<p>Please log in as a client to view prescriptions.</p>';
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
            listContainer.innerHTML = '';

            if (!Array.isArray(data) || data.length === 0) {
                listContainer.innerHTML = '<p>No prescriptions found.</p>';
                return;
            }

            const item = data[0];

            const card = document.createElement('div');
            card.classList.add('prescription-card');
            card.innerHTML = `
                <p>${item.genericName ?? ''}</p>
                <p>${item.dosage ?? ''}</p>
                <p>${item.remainingAmount ?? ''}</p>
                <p>${item.description ?? ''}</p>
            `;
            listContainer.appendChild(card);
        })
        .catch(err => {
            listContainer.innerHTML = '<p>Error loading prescriptions.</p>';
            console.error('Failed to fetch prescriptions:', err);
        });
});
