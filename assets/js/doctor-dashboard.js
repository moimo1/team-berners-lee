document.addEventListener('DOMContentLoaded', () => {
    const prescriptionsList = document.getElementById('recent-prescriptions-list');

    // Fetch recent prescriptions for this doctor
    fetch('../../controller/get-prescription-history.php', { credentials: 'same-origin' })
        .then(res => {
            if (res.status === 401) {
                prescriptionsList.innerHTML = '<p class="error">Please log in to view prescriptions.</p>';
                return null;
            }
            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            if (data === null) return;

            prescriptionsList.innerHTML = '';

            if (!Array.isArray(data) || data.length === 0) {
                prescriptionsList.innerHTML = '<p class="no-data">No prescriptions found.</p>';
                return;
            }

            // Show only the 5 most recent prescriptions
            const recentPrescriptions = data.slice(0, 5);

            recentPrescriptions.forEach(item => {
                const prescriptionItem = document.createElement('div');
                prescriptionItem.className = 'prescription-item';

                const formatDate = (dateString) => {
                    if (!dateString) return 'N/A';
                    const date = new Date(dateString);
                    return isNaN(date) ? 'N/A' : date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    });
                };

                prescriptionItem.innerHTML = `
                    <div class="prescription-date">${formatDate(item.dateGiven)}</div>
                    <div class="prescription-info">
                        <div class="prescription-doctor">${item.clientFirstName || ''} ${item.clientLastName || ''}</div>
                        <div class="prescription-expiry">Expires: ${formatDate(item.dateExpiry)}</div>
                    </div>
                `;

                prescriptionItem.style.cursor = 'pointer';
                prescriptionItem.addEventListener('click', (e) => {
                    console.log('Prescription item clicked:', item.prescID);
                    e.stopPropagation();
                    showPrescriptionDetails(item.prescID, item);
                });

                prescriptionsList.appendChild(prescriptionItem);
            });
        })
        .catch(err => {
            console.error('Failed to fetch prescriptions:', err);
            prescriptionsList.innerHTML = '<p class="error">Error loading prescriptions. Please try again.</p>';
        });
});

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showPrescriptionDetails(prescID, prescriptionData) {
    console.log('showPrescriptionDetails called with prescID:', prescID);
    const modal = document.getElementById('prescription-details-modal');
    const detailsBody = document.getElementById('prescription-details-body');

    console.log('Modal element:', modal);
    console.log('Details body element:', detailsBody);

    if (!modal || !detailsBody) {
        console.error('Modal or details body not found!');
        return;
    }

    detailsBody.innerHTML = '<p>Loading prescription details...</p>';
    modal.style.display = 'block';
    console.log('Modal display set to block');

    fetch(`../../controller/get-prescription-details.php?prescID=${escapeHtml(prescID)}`, {
        credentials: 'same-origin'
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`Failed to fetch details: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            if (data.error) {
                detailsBody.innerHTML = `<p class="error">${escapeHtml(data.error)}</p>`;
                return;
            }

            const formatDate = (dateString) => {
                if (!dateString) return 'N/A';
                const date = new Date(dateString);
                return isNaN(date) ? 'N/A' : date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            };

            let html = `
                <div class="prescription-details-section">
                    <h4>Patient Information</h4>
                    <p><strong>Name:</strong> ${escapeHtml(data.clientFirstName || '')} ${escapeHtml(data.clientLastName || '')}</p>
                    <p><strong>Prescription ID:</strong> ${escapeHtml(prescID)}</p>
                    <p><strong>Date Given:</strong> ${formatDate(prescriptionData.dateGiven)}</p>
                    <p><strong>Expiry Date:</strong> ${formatDate(prescriptionData.dateExpiry)}</p>
                </div>
            `;

            if (data.medicines && data.medicines.length > 0) {
                html += `
                    <div class="medications-section">
                        <h4>Medications</h4>
                        <div class="medications-grid">
                `;

                data.medicines.forEach((medicine, index) => {
                    html += `
                        <div class="medicine-card">
                            <p class="medicine-name">${escapeHtml(medicine.medicineName || 'N/A')}</p>
                            <p><strong>Dosage:</strong> ${escapeHtml(medicine.dosage || 'N/A')}</p>
                            <p><strong>Amount Remaining:</strong> ${medicine.amountRemaining ?? 'N/A'}</p>
                        </div>
                    `;
                });

                html += `
                        </div>
                    </div>
                `;
            } else {
                html += '<p class="no-medications">No medications found for this prescription.</p>';
            }

            detailsBody.innerHTML = html;
        })
        .catch(err => {
            console.error('Failed to fetch prescription details:', err);
            detailsBody.innerHTML = '<p class="error">Error loading prescription details. Please try again.</p>';
        });

    const closeBtn = modal.querySelector('.close-btn');
    if (closeBtn && !closeBtn.hasAttribute('data-listener-attached')) {
        closeBtn.setAttribute('data-listener-attached', 'true');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            detailsBody.innerHTML = '';
        });
    }

    if (!modal.hasAttribute('data-modal-listener-attached')) {
        modal.setAttribute('data-modal-listener-attached', 'true');
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                detailsBody.innerHTML = '';
            }
        });
    }
}

