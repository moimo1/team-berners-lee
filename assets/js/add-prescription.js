document.addEventListener('DOMContentLoaded', () => {
    let allMedicines = [];
    let allClients = [];
    let selectedMedicines = [];
    let currentSelectedMedicine = null; // Store the medicine selected in modal
    let currentSelectedClient = null; // Store the client selected

    // Fetch all medicines from database
    fetch('../../controller/get-medicines.php', { credentials: 'same-origin' })
        .then(res => res.json())
        .then(data => {
            allMedicines = data;
        })
        .catch(err => {
            console.error('Failed to fetch medicines:', err);
        });

    // Fetch all clients from database
    fetch('../../controller/get-clients.php', { credentials: 'same-origin' })
        .then(res => res.json())
        .then(data => {
            allClients = data;
        })
        .catch(err => {
            console.error('Failed to fetch clients:', err);
        });

    // --- TEMPLATE LOGIC START ---
    const loadTemplateSelect = document.getElementById('load-template');
    const saveTemplateCheckbox = document.getElementById('save-template');
    const templateNameContainer = document.getElementById('template-name-container');
    const templateNameInput = document.getElementById('template-name');
    let allTemplates = [];


    function fetchTemplatesForClient(clientId) {
        if (!loadTemplateSelect) return;

        // Clear previous options
        loadTemplateSelect.innerHTML = '<option value="">-- Select a Template --</option>';
        allTemplates = [];

        if (!clientId) return;

        fetch(`../../controller/get-templates.php?client_id=${clientId}`, { credentials: 'same-origin' })
            .then(res => res.json())
            .then(data => {
                allTemplates = data;
                if (data.length === 0) {
                    const opt = document.createElement('option');
                    opt.value = "";
                    opt.textContent = "No templates found for this client";
                    opt.disabled = true;
                    loadTemplateSelect.appendChild(opt);
                } else {
                    data.forEach(tpl => {
                        const opt = document.createElement('option');
                        opt.value = tpl.templateID;
                        opt.textContent = tpl.templateName;
                        loadTemplateSelect.appendChild(opt);
                    });
                }
            })
            .catch(err => console.error('Failed to fetch templates:', err));
    }

    // Load Template Handler
    if (loadTemplateSelect) {
        loadTemplateSelect.addEventListener('change', (e) => {
            const tplId = e.target.value;
            if (!tplId) return;

            const tpl = allTemplates.find(t => t.templateID == tplId);
            if (tpl && tpl.medicines) {
                // Clear existing medicines if any? Or append? usually clear or confirmation.
                // For simplicity, we just add them.
                if (selectedMedicines.length > 0) {
                    if (!confirm('This will append to your current list. Continue?')) {
                        loadTemplateSelect.value = "";
                        return;
                    }
                }

                tpl.medicines.forEach(m => {
                    selectedMedicines.push({
                        id: m.medID,
                        name: getMedicineNameById(m.medID), // Helper needed or store name in JSON
                        brand: '', // JSON might not have brand, fetch it?
                        medID: m.medID,
                        dosage: m.dosage,
                        amount: m.amount,
                        description: m.description
                    });
                });
                updateSelectedMedicinesDisplay();
            }
        });
    }

    // Toggle Template Name Visibility
    if (saveTemplateCheckbox) {
        saveTemplateCheckbox.addEventListener('change', (e) => {
            templateNameContainer.style.display = e.target.checked ? 'block' : 'none';
            if (e.target.checked) templateNameInput.focus();
        });
    }

    // Helper to get name from ID (since template only stores ID in my simplified JSON plan, strictly speaking we need to match it)
    function getMedicineNameById(id) {
        const med = allMedicines.find(m => m.medID === id);
        return med ? med.genericName : 'Unknown Medicine';
    }
    // --- TEMPLATE LOGIC END ---

    const clientNameInput = document.getElementById('client-name');
    const clientIdInput = document.getElementById('client-id');
    const clientDropdown = document.getElementById('client-dropdown');
    const medicineSearch = document.getElementById('medicine-search');
    const selectedMedicinesList = document.getElementById('selected-medicines-list');
    const addMedicineBtn = document.getElementById('add-medicine-btn');
    const medicineDetailsModal = document.getElementById('medicine-details-modal');
    const modalMedicineSearch = document.getElementById('modal-medicine-search');
    const modalMedicineDropdown = document.getElementById('modal-medicine-dropdown');
    const medicineDosage = document.getElementById('medicine-dosage');
    const medicineAmount = document.getElementById('medicine-amount');
    const medicineDescription = document.getElementById('medicine-description');
    const confirmMedicineBtn = document.getElementById('confirm-medicine-btn');
    const cancelMedicineBtn = document.getElementById('cancel-medicine-btn');
    const medicineModalClose = document.querySelector('.medicine-modal-close');

    function filterMedicines(query) {
        if (!query || query.trim() === '') {
            return allMedicines;
        }

        const lowerQuery = query.toLowerCase();
        return allMedicines.filter(medicine => {
            const genericName = (medicine.genericName || '').toLowerCase();
            const brand = (medicine.brand || '').toLowerCase();
            return genericName.includes(lowerQuery) || brand.includes(lowerQuery);
        });
    }

    function displayMedicineDropdownInModal(medicines) {
        modalMedicineDropdown.innerHTML = '';

        if (medicines.length === 0) {
            modalMedicineDropdown.innerHTML = '<div class="dropdown-item no-results">No medicines found</div>';
            modalMedicineDropdown.style.display = 'block';
            return;
        }

        medicines.slice(0, 10).forEach(medicine => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.innerHTML = `
                <strong>${escapeHtml(medicine.genericName || 'N/A')}</strong>
                ${medicine.brand ? `<span class="brand-name">${escapeHtml(medicine.brand)}</span>` : ''}
            `;
            item.addEventListener('click', () => {
                selectMedicineInModal(medicine);
            });
            modalMedicineDropdown.appendChild(item);
        });

        modalMedicineDropdown.style.display = 'block';
    }

    function selectMedicineInModal(medicine) {
        // Store the selected medicine
        currentSelectedMedicine = medicine;

        // Display medicine name in the modal search field
        const displayName = `${medicine.genericName}${medicine.brand ? ' (' + medicine.brand + ')' : ''}`;
        modalMedicineSearch.value = displayName;

        // Hide dropdown
        modalMedicineDropdown.style.display = 'none';
    }

    function showMedicineDetailsModal() {
        // Clear previous values
        currentSelectedMedicine = null;
        modalMedicineSearch.value = '';
        medicineDosage.value = '';
        medicineAmount.value = '';
        medicineDescription.value = '';
        modalMedicineDropdown.style.display = 'none';

        // Show modal
        medicineDetailsModal.style.display = 'block';

        // Focus on the medicine search input
        setTimeout(() => {
            modalMedicineSearch.focus();
        }, 100);
    }

    function hideMedicineDetailsModal() {
        medicineDetailsModal.style.display = 'none';
        currentSelectedMedicine = null;
        modalMedicineSearch.value = '';
        medicineDosage.value = '';
        medicineAmount.value = '';
        medicineDescription.value = '';
        modalMedicineDropdown.style.display = 'none';
    }

    function confirmMedicineDetails() {
        const dosage = medicineDosage.value.trim();
        const amount = medicineAmount.value.trim();
        const description = medicineDescription.value.trim();

        if (!currentSelectedMedicine) {
            alert('Please select a medicine');
            return;
        }

        if (!dosage || !amount || !description) {
            alert('Please fill in dosage, amount, and description');
            return;
        }

        // Validate amount is a positive number
        const amountNum = parseInt(amount);
        if (isNaN(amountNum) || amountNum < 1) {
            alert('Please enter a valid amount (at least 1)');
            return;
        }

        // Add medicine to selected medicines with details
        const medicineData = {
            id: currentSelectedMedicine.medID,
            name: currentSelectedMedicine.genericName,
            brand: currentSelectedMedicine.brand || '',
            medID: currentSelectedMedicine.medID,
            dosage: dosage,
            amount: amountNum,
            description: description
        };

        selectedMedicines.push(medicineData);

        // Update display
        updateSelectedMedicinesDisplay();

        // Hide modal and clear current selection
        hideMedicineDetailsModal();
    }

    function updateSelectedMedicinesDisplay() {
        selectedMedicinesList.innerHTML = '';

        if (selectedMedicines.length === 0) {
            return;
        }

        selectedMedicines.forEach((medicine, index) => {
            const medicineItem = document.createElement('div');
            medicineItem.className = 'selected-medicine-item';
            medicineItem.innerHTML = `
                <div class="medicine-info">
                    <div class="medicine-name">${escapeHtml(medicine.name)}${medicine.brand ? ' (' + escapeHtml(medicine.brand) + ')' : ''}</div>
                    <div class="medicine-details">
                        <div class="medicine-dosage-display"><strong>Dosage:</strong> ${escapeHtml(medicine.dosage || 'N/A')}</div>
                        <div class="medicine-amount-display"><strong>Amount:</strong> ${escapeHtml(medicine.amount || 'N/A')}</div>
                        <div class="medicine-description-display"><strong>Description:</strong> ${escapeHtml(medicine.description || 'N/A')}</div>
                    </div>
                </div>
                <button type="button" class="remove-medicine-btn" data-index="${index}">×</button>
            `;

            const removeBtn = medicineItem.querySelector('.remove-medicine-btn');
            removeBtn.addEventListener('click', () => {
                removeMedicine(index);
            });

            selectedMedicinesList.appendChild(medicineItem);
        });
    }

    function removeMedicine(index) {
        selectedMedicines.splice(index, 1);
        updateSelectedMedicinesDisplay();
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Client search functionality
    function filterClients(query) {
        if (!query || query.trim() === '') {
            return allClients;
        }

        const lowerQuery = query.toLowerCase();
        return allClients.filter(client => {
            const firstName = (client.firstName || '').toLowerCase();
            const lastName = (client.lastName || '').toLowerCase();
            const fullName = `${firstName} ${lastName}`.toLowerCase();
            return firstName.includes(lowerQuery) ||
                lastName.includes(lowerQuery) ||
                fullName.includes(lowerQuery);
        });
    }

    function displayClientDropdown(clients) {
        clientDropdown.innerHTML = '';

        if (clients.length === 0) {
            clientDropdown.innerHTML = '<div class="dropdown-item no-results">No clients found</div>';
            clientDropdown.style.display = 'block';
            return;
        }

        clients.slice(0, 10).forEach(client => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.innerHTML = `
                <strong>${escapeHtml(client.firstName || '')} ${escapeHtml(client.lastName || '')}</strong>
            `;
            item.addEventListener('click', () => {
                selectClient(client);
            });
            clientDropdown.appendChild(item);
        });

        clientDropdown.style.display = 'block';
    }

    function selectClient(client) {
        // Store the selected client
        currentSelectedClient = client;

        // Display client name in the input field
        const displayName = `${client.firstName} ${client.lastName}`;
        clientNameInput.value = displayName;
        clientIdInput.value = client.clientID;

        // Fetch templates for this client
        fetchTemplatesForClient(client.clientID);

        // Hide dropdown
        clientDropdown.style.display = 'none';
    }

    // Client name input event listeners
    if (clientNameInput) {
        clientNameInput.setAttribute('autocomplete', 'off');
        clientNameInput.setAttribute('list', '');

        clientNameInput.addEventListener('input', (e) => {
            const query = e.target.value;
            const filtered = filterClients(query);
            displayClientDropdown(filtered);
            // Clear current selection when user types
            if (query && !query.includes(currentSelectedClient?.firstName || '') && !query.includes(currentSelectedClient?.lastName || '')) {
                currentSelectedClient = null;
                clientIdInput.value = '';
            }
        });

        clientNameInput.addEventListener('focus', () => {
            if (clientNameInput.value) {
                const filtered = filterClients(clientNameInput.value);
                displayClientDropdown(filtered);
            }
        });
    }

    // Hide dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        // Hide client dropdown
        if (clientNameInput && clientDropdown) {
            if (!clientNameInput.contains(e.target) && !clientDropdown.contains(e.target)) {
                clientDropdown.style.display = 'none';
            }
        }

        // Hide modal medicine dropdown
        if (modalMedicineSearch && modalMedicineDropdown) {
            if (!modalMedicineSearch.contains(e.target) && !modalMedicineDropdown.contains(e.target)) {
                modalMedicineDropdown.style.display = 'none';
            }
        }
    });

    // Modal medicine search event listeners
    if (modalMedicineSearch) {
        modalMedicineSearch.setAttribute('autocomplete', 'off');
        modalMedicineSearch.setAttribute('list', '');

        modalMedicineSearch.addEventListener('input', (e) => {
            const query = e.target.value;
            const filtered = filterMedicines(query);
            displayMedicineDropdownInModal(filtered);
            // Clear current selection when user types
            if (query && !query.includes(currentSelectedMedicine?.genericName || '')) {
                currentSelectedMedicine = null;
            }
        });

        modalMedicineSearch.addEventListener('focus', () => {
            if (modalMedicineSearch.value) {
                const filtered = filterMedicines(modalMedicineSearch.value);
                displayMedicineDropdownInModal(filtered);
            }
        });
    }


    // Add medicine button - opens modal
    if (addMedicineBtn) {
        addMedicineBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showMedicineDetailsModal();
        });
    }

    // Make the input field clickable to open modal
    if (medicineSearch) {
        medicineSearch.addEventListener('click', () => {
            showMedicineDetailsModal();
        });
    }

    // Modal close handlers
    if (medicineModalClose) {
        medicineModalClose.addEventListener('click', () => {
            hideMedicineDetailsModal();
        });
    }

    if (cancelMedicineBtn) {
        cancelMedicineBtn.addEventListener('click', () => {
            hideMedicineDetailsModal();
        });
    }

    if (confirmMedicineBtn) {
        confirmMedicineBtn.addEventListener('click', () => {
            confirmMedicineDetails();
        });
    }

    // Close modal when clicking outside
    if (medicineDetailsModal) {
        medicineDetailsModal.addEventListener('click', (e) => {
            if (e.target === medicineDetailsModal) {
                hideMedicineDetailsModal();
            }
        });
    }

    // Update form submission to include medicine details
    const form = document.getElementById('create-prescription-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate that at least one medicine is added
            if (selectedMedicines.length === 0) {
                alert('Please add at least one medicine');
                return false;
            }

            // Validate that a client is selected
            if (!clientIdInput.value || !currentSelectedClient) {
                alert('Please select a client');
                return false;
            }

            // Prepare form data
            const formData = new FormData(form);

            // Add medicine data to form data
            selectedMedicines.forEach((medicine, index) => {
                formData.append(`medicine-${index}-id`, medicine.id);
                formData.append(`medicine-${index}-name`, medicine.name);
                formData.append(`medicine-${index}-dosage`, medicine.dosage);
                formData.append(`medicine-${index}-amount`, medicine.amount);
                formData.append(`medicine-${index}-description`, medicine.description);
            });

            // Disable submit button to prevent double submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';

            try {
                // Submit form data via fetch
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    credentials: 'same-origin'
                });

                const result = await response.json();

                if (result.success) {
                    // Show success message and redirect to dashboard
                    alert('Prescription created successfully!');
                    window.location.href = './dashboard.php';
                } else {
                    // Show error message
                    alert(result.error || 'Failed to create prescription. Please try again.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            } catch (error) {
                console.error('Error creating prescription:', error);
                alert('An error occurred while creating the prescription. Please try again.');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
});
