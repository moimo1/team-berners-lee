document.addEventListener('DOMContentLoaded', () => {
    prescriptionContainer = document.getElementById('medicine-list');

    fetch('../../controller/get-prescription.php', { credentials: 'same-origin' })
        .then(res => {
            return res.json();
        })
        .then(data => {
            data.forEach(item => {
                medicine = document.createElement('p');
                medicine.textContent = `${item.genericName} - ${item.dosage} - ${item.remainingAmount} remaining`;
                prescriptionContainer.appendChild(medicine);
            });
        });
});