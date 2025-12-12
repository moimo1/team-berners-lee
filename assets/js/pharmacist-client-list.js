// Global variables for prescription data
let allPrescriptions = [];
let currentPrescriptionData = null; // Store current prescription data for refresh

document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('prescription-table-body');
    const searchInput = document.querySelector('#searchbar');

    // Fetch all prescriptions initially
    fetch('../../controller/get-all-prescriptions.php', { credentials: 'same-origin' })
        .then(res => {
            if (res.status === 401) {
                listContainer.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 24px; color: #dc2626;">Please log in to view prescriptions.</td></tr>';
                return null;
            }
            if (!res.ok) {
                throw new Error(`Request failed: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            if (data === null) return;

            allPrescriptions = data;
            renderPrescriptions(allPrescriptions);
        })
        .catch(err => {
            console.error('Failed to fetch prescriptions:', err);
            listContainer.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 24px; color: #dc2626;">Error loading prescriptions. Please try again.</td></tr>';
        });

    // Live search as the user types
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();

            if (query === '') {
                renderPrescriptions(allPrescriptions);
                return;
            }

            // Filter prescriptions by client name or prescription ID
            const filtered = allPrescriptions.filter(item => {
                const first = item.clientFirstName?.toLowerCase() ?? '';
                const last = item.clientLastName?.toLowerCase() ?? '';
                const fullName = `${first} ${last}`.trim().toLowerCase();
                const prescID = (item.prescID || '').toLowerCase();

                return (
                    fullName.includes(query) ||
                    first.includes(query) ||
                    last.includes(query) ||
                    prescID.includes(query)
                );
            });

            renderPrescriptions(filtered);
        });
    }
});

function renderPrescriptions(prescriptions) {
    const listContainer = document.getElementById('prescription-table-body');
    listContainer.innerHTML = '';

    if (!Array.isArray(prescriptions) || prescriptions.length === 0) {
        listContainer.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 24px; color: #64748b;">No prescriptions found.</td></tr>';
        return;
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return isNaN(date) ? 'N/A' : date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    prescriptions.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span style="color: #64748b; font-family: monospace;">#${escapeHtml(item.prescID)}</span></td>
            <td>${escapeHtml(item.clientFirstName ?? '')} ${escapeHtml(item.clientLastName ?? '')}</td>
            <td>${formatDate(item.dateGiven)}</td>
            <td>${formatDate(item.dateExpiry)}</td>
        `;
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => {
            showPrescriptionDetails(item.prescID, item);
        });
        listContainer.appendChild(row);
    });
}

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

    if (!modal || !detailsBody) {
        console.error('Modal or details body not found!');
        return;
    }

    // Store prescription data for later use (e.g., after purchase refresh)
    if (prescriptionData) {
        currentPrescriptionData = prescriptionData;
    }

    // Show loading state
    detailsBody.innerHTML = '<p>Loading prescription details...</p>';
    modal.style.display = 'block';

    // Fetch prescription details
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

            // Format dates
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
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Medicine</th>
                                    <th>Dosage</th>
                                    <th>Remaining</th>
                                </tr>
                            </thead>
                            <tbody>
                `;

                data.medicines.forEach((medicine, index) => {
                    const remainingAmount = medicine.amountRemaining ?? null;
                    const remainingDisplay = remainingAmount === null ? 'Unlimited' : remainingAmount;
                    const isClickable = remainingAmount === null || remainingAmount > 0;

                    html += `
                        <tr class="medicine-row ${isClickable ? 'clickable-medicine' : ''}" 
                             data-med-id="${escapeHtml(medicine.medID || '')}"
                             data-presc-id="${escapeHtml(prescID)}"
                             data-medicine-name="${escapeHtml(medicine.medicineName || 'N/A')}"
                             data-remaining-amount="${remainingAmount === null ? 'null' : remainingAmount}"
                             ${isClickable ? 'style="cursor: pointer;"' : 'style="opacity: 0.6; cursor: not-allowed;"'}>
                            <td>${escapeHtml(medicine.medicineName || 'N/A')}</td>
                            <td>${escapeHtml(medicine.dosage || 'N/A')}</td>
                            <td>${remainingDisplay}</td>
                        </tr>
                    `;
                });

                html += `
                            </tbody>
                        </table>
                    </div>
                `;
            } else {
                html += '<p class="no-medications">No medications found for this prescription.</p>';
            }

            detailsBody.innerHTML = html;

            // Attach click handlers to medicine cards
            const medicineCards = detailsBody.querySelectorAll('.clickable-medicine');
            medicineCards.forEach(card => {
                card.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const medID = card.getAttribute('data-med-id');
                    const prescID = card.getAttribute('data-presc-id');
                    const medicineName = card.getAttribute('data-medicine-name');
                    const remainingAmount = card.getAttribute('data-remaining-amount');

                    showPurchaseModal({
                        medID: medID,
                        prescID: prescID,
                        medicineName: medicineName,
                        remainingAmount: remainingAmount === 'null' ? null : parseInt(remainingAmount)
                    });
                });
            });
        })
        .catch(err => {
            console.error('Failed to fetch prescription details:', err);
            detailsBody.innerHTML = '<p class="error">Error loading prescription details. Please try again.</p>';
        });

    // Close button functionality - set up once
    const closeBtn = modal.querySelector('.close-btn');
    if (closeBtn && !closeBtn.hasAttribute('data-listener-attached')) {
        closeBtn.setAttribute('data-listener-attached', 'true');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            detailsBody.innerHTML = '';
        });
    }

    // Close modal when clicking outside (on the modal background)
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

function showPurchaseModal(medicineData) {
    const purchaseModal = document.getElementById('purchase-modal');
    const medicineNameDisplay = document.getElementById('medicine-name-display');
    const remainingAmountDisplay = document.getElementById('remaining-amount-display');
    const purchaseAmountInput = document.getElementById('purchase-amount');
    const purchasePrescID = document.getElementById('purchase-presc-id');
    const purchaseMedID = document.getElementById('purchase-med-id');
    const amountError = document.getElementById('amount-error');
    const confirmBtn = document.getElementById('confirm-purchase-btn');

    if (!purchaseModal) {
        console.error('Purchase modal not found!');
        return;
    }

    // Reset button state
    if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirm Purchase';
    }

    // Populate form fields
    medicineNameDisplay.value = medicineData.medicineName || 'N/A';
    const remainingDisplay = medicineData.remainingAmount === null ? 'Unlimited' : medicineData.remainingAmount;
    remainingAmountDisplay.value = remainingDisplay;
    purchasePrescID.value = medicineData.prescID;
    purchaseMedID.value = medicineData.medID;
    purchaseAmountInput.value = '';
    purchaseAmountInput.max = medicineData.remainingAmount === null ? '' : medicineData.remainingAmount;
    amountError.style.display = 'none';
    amountError.textContent = '';

    // Store current medicine data for use in form submission
    purchaseModal.setAttribute('data-current-medicine', JSON.stringify(medicineData));

    // Show modal
    purchaseModal.style.display = 'block';

    // Set up close handlers (only once)
    const closeBtn = purchaseModal.querySelector('.purchase-close-btn');
    if (closeBtn && !closeBtn.hasAttribute('data-listener-attached')) {
        closeBtn.setAttribute('data-listener-attached', 'true');
        closeBtn.addEventListener('click', () => {
            purchaseModal.style.display = 'none';
            // Reset button state when closing
            if (confirmBtn) {
                confirmBtn.disabled = false;
                confirmBtn.textContent = 'Confirm Purchase';
            }
        });
    }

    // Close modal when clicking outside
    if (!purchaseModal.hasAttribute('data-modal-listener-attached')) {
        purchaseModal.setAttribute('data-modal-listener-attached', 'true');
        purchaseModal.addEventListener('click', (event) => {
            if (event.target === purchaseModal) {
                purchaseModal.style.display = 'none';
                // Reset button state when closing
                if (confirmBtn) {
                    confirmBtn.disabled = false;
                    confirmBtn.textContent = 'Confirm Purchase';
                }
            }
        });
    }

    // Form submission - use event delegation or fresh listener
    const purchaseForm = document.getElementById('purchase-form');
    if (purchaseForm) {
        // Remove old submit listener by cloning (removes all listeners)
        const formClone = purchaseForm.cloneNode(true);
        purchaseForm.parentNode.replaceChild(formClone, purchaseForm);

        // Get fresh references after replacement
        const freshForm = document.getElementById('purchase-form');
        const freshPurchaseAmountInput = document.getElementById('purchase-amount');
        const freshAmountError = document.getElementById('amount-error');
        const freshCancelBtn = document.getElementById('cancel-purchase-btn');
        const freshConfirmBtn = document.getElementById('confirm-purchase-btn');

        // Reset confirm button state
        if (freshConfirmBtn) {
            freshConfirmBtn.disabled = false;
            freshConfirmBtn.textContent = 'Confirm Purchase';
        }

        // Add fresh submit listener
        if (freshForm) {
            freshForm.addEventListener('submit', (e) => {
                e.preventDefault();
                handlePurchase();
            });
        }

        // Real-time validation with current medicine data
        if (freshPurchaseAmountInput) {
            freshPurchaseAmountInput.addEventListener('input', () => {
                validatePurchaseAmount(freshPurchaseAmountInput.value, medicineData.remainingAmount, freshAmountError);
            });
        }

        // Re-attach cancel button listener
        if (freshCancelBtn) {
            freshCancelBtn.addEventListener('click', () => {
                purchaseModal.style.display = 'none';
                // Reset button state when closing
                const resetBtn = document.getElementById('confirm-purchase-btn');
                if (resetBtn) {
                    resetBtn.disabled = false;
                    resetBtn.textContent = 'Confirm Purchase';
                }
            });
        }
    }
}

function validatePurchaseAmount(amount, remainingAmount, errorElement) {
    const amountNum = parseInt(amount);

    if (!amount || amount.trim() === '') {
        errorElement.style.display = 'none';
        errorElement.textContent = '';
        return false;
    }

    if (isNaN(amountNum) || amountNum <= 0) {
        errorElement.style.display = 'block';
        errorElement.textContent = 'Amount must be a positive number.';
        return false;
    }

    if (remainingAmount !== null && amountNum > remainingAmount) {
        errorElement.style.display = 'block';
        errorElement.textContent = `Cannot purchase more than ${remainingAmount} (remaining amount).`;
        return false;
    }

    errorElement.style.display = 'none';
    errorElement.textContent = '';
    return true;
}

function handlePurchase() {
    const purchaseModal = document.getElementById('purchase-modal');
    const purchaseAmountInput = document.getElementById('purchase-amount');
    const amountError = document.getElementById('amount-error');
    const confirmBtn = document.getElementById('confirm-purchase-btn');
    const purchasePrescID = document.getElementById('purchase-presc-id');
    const purchaseMedID = document.getElementById('purchase-med-id');

    if (!purchaseAmountInput || !purchasePrescID || !purchaseMedID) {
        console.error('Required form elements not found');
        return;
    }

    // Get current medicine data from modal attribute
    let medicineData;
    if (purchaseModal && purchaseModal.hasAttribute('data-current-medicine')) {
        try {
            medicineData = JSON.parse(purchaseModal.getAttribute('data-current-medicine'));
        } catch (e) {
            console.error('Failed to parse medicine data:', e);
            return;
        }
    } else {
        console.error('Medicine data not found');
        return;
    }

    const purchaseAmount = parseInt(purchaseAmountInput.value);

    // Validate amount
    if (!validatePurchaseAmount(purchaseAmountInput.value, medicineData.remainingAmount, amountError)) {
        return;
    }

    // Disable button during request
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Processing...';
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('prescID', purchasePrescID.value);
    formData.append('medID', purchaseMedID.value);
    formData.append('amount', purchaseAmount);

    // Send purchase request
    fetch('../../controller/update-prescription-amount.php', {
        method: 'POST',
        credentials: 'same-origin',
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                if (amountError) {
                    amountError.style.display = 'block';
                    amountError.textContent = data.message || data.error;
                }
                if (confirmBtn) {
                    confirmBtn.disabled = false;
                    confirmBtn.textContent = 'Confirm Purchase';
                }
                return;
            }

            if (data.success) {
                // Close purchase modal
                if (purchaseModal) {
                    purchaseModal.style.display = 'none';
                }

                // Reset button state
                if (confirmBtn) {
                    confirmBtn.disabled = false;
                    confirmBtn.textContent = 'Confirm Purchase';
                }

                // Show success message
                alert(`Purchase successful! Purchased ${purchaseAmount} units. Remaining: ${data.remainingAmount === null ? 'Unlimited' : data.remainingAmount}`);

                // Refresh prescription details to show updated amounts
                // Use stored prescription data or fetch from allPrescriptions
                let prescriptionData = currentPrescriptionData;
                if (!prescriptionData) {
                    // Try to find it in allPrescriptions
                    const found = allPrescriptions.find(p => p.prescID === medicineData.prescID);
                    if (found) {
                        prescriptionData = found;
                    } else {
                        prescriptionData = { dateGiven: null, dateExpiry: null };
                    }
                }

                // Re-fetch and display updated prescription details
                showPrescriptionDetails(medicineData.prescID, prescriptionData);
            }
        })
        .catch(err => {
            console.error('Failed to process purchase:', err);
            if (amountError) {
                amountError.style.display = 'block';
                amountError.textContent = 'Error processing purchase. Please try again.';
            }
            if (confirmBtn) {
                confirmBtn.disabled = false;
                confirmBtn.textContent = 'Confirm Purchase';
            }
        });
}

