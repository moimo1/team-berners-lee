document.addEventListener(() => {
    const listContainer = document.getElementById('prescription-list');

    fetch('../../controller/get-prescriptions.php')
    .then(res => res.json())
    .then(data => {
        listContainer.innerHTML='';

        data.forEach(prescription => {
            card = document.createElement('div');
            card.classList.add('prescription-card');
            card.innerHTML = `
                <p>${prescription.medID}</p>
                <p>${prescription.dosage}</p>
                <p>${prescription.remainingAmount}</p>
                <p>${prescription.description}</p>
            `;

            listContainer.appendChild(card);
        });
    }).catch(err => {
        listContainer.innerHTML = `<p>Error loading prescriptions.</p>`;
        console.error(err);
    })
})