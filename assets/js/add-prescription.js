
let allMedicines = [];
let allClients = [];
let selectedMedicines = [];

let currentSelectedClient = null;
let currentSelectedMedicine = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded. Configuring...');

    loadAllMedicines();
    loadAllClients();
    setupClientSearch();
    setupMedicineSearch();
    setupFormSubmission();
    setupTemplates();
});


async function loadAllMedicines() {
    try {
        const response = await fetch('../../controller/get-medicines.php', { credentials: 'same-origin' });
        const data = await response.json();
        allMedicines = data;
        console.log('Medicines loaded:', allMedicines.length);
    } catch (error) {
        console.error('Error loading medicines:', error);
    }
}

async function loadAllClients() {
    try {
        const response = await fetch('../../controller/get-clients.php', { credentials: 'same-origin' });
        const data = await response.json();
        allClients = data;
        console.log('Clients loaded:', allClients.length);
    } catch (error) {
        console.error('Error loading clients:', error);
    }
}

function setupClientSearch() {
    const nameInput = document.getElementById('client-name');
    const dropdown = document.getElementById('client-dropdown');
    const idInput = document.getElementById('client-id'); // Hidden input for Database ID

    if (!nameInput) return;

    nameInput.addEventListener('input', (e) => {
        const text = e.target.value.toLowerCase();

        const matches = allClients.filter(c => {
            const fullName = (c.firstName + ' ' + c.lastName).toLowerCase();
            return fullName.includes(text);
        });

        showClientDropdown(matches);

        if (text === '') {
            currentSelectedClient = null;
            idInput.value = '';
        }
    });

    nameInput.addEventListener('focus', () => {
        if (nameInput.value) {
            nameInput.dispatchEvent(new Event('input'));
        }
    });

    document.addEventListener('click', (e) => {
        if (!nameInput.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
}

function showClientDropdown(clients) {
    const dropdown = document.getElementById('client-dropdown');
    dropdown.innerHTML = '';

    if (clients.length === 0) {
        dropdown.style.display = 'none';
        return;
    }

    clients.slice(0, 10).forEach(client => {
        const div = document.createElement('div');
        div.className = 'dropdown-item';
        div.textContent = `${client.firstName} ${client.lastName}`;

        div.addEventListener('click', () => {
            selectClient(client);
            dropdown.style.display = 'none';
        });

        dropdown.appendChild(div);
    });

    dropdown.style.display = 'block';
}

function selectClient(client) {
    currentSelectedClient = client;

    document.getElementById('client-name').value = `${client.firstName} ${client.lastName}`;
    document.getElementById('client-id').value = client.clientID;

    loadTemplatesForClient(client.clientID);
}


function setupMedicineSearch() {
    const openBtn = document.getElementById('add-medicine-btn');
    const modal = document.getElementById('medicine-details-modal');
    const closeBtn = document.querySelector('.medicine-modal-close');
    const cancelBtn = document.getElementById('cancel-medicine-btn');
    const confirmBtn = document.getElementById('confirm-medicine-btn');

    const searchInput = document.getElementById('modal-medicine-search');
    const dropdown = document.getElementById('modal-medicine-dropdown');

    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resetMedicineModal();
            modal.style.display = 'block';
            setTimeout(() => searchInput.focus(), 100);
        });
    }

    const closeModal = () => { modal.style.display = 'none'; };
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const text = e.target.value.toLowerCase();

            const matches = allMedicines.filter(m => {
                const name = (m.genericName || '').toLowerCase();
                const brand = (m.brand || '').toLowerCase();
                return name.includes(text) || brand.includes(text);
            });

            dropdown.innerHTML = '';
            matches.slice(0, 10).forEach(med => {
                const div = document.createElement('div');
                div.className = 'dropdown-item';
                div.innerHTML = `<strong>${med.genericName}</strong> <small>(${med.brand || 'Generic'})</small>`;

                div.addEventListener('click', () => {
                    currentSelectedMedicine = med;
                    searchInput.value = med.genericName;
                    dropdown.style.display = 'none';
                });

                dropdown.appendChild(div);
            });

            dropdown.style.display = matches.length ? 'block' : 'none';
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            addMedicineToList();
            closeModal();
        });
    }
}

function resetMedicineModal() {
    currentSelectedMedicine = null;
    document.getElementById('modal-medicine-search').value = '';
    document.getElementById('medicine-dosage').value = '';
    document.getElementById('medicine-amount').value = '';
    document.getElementById('medicine-description').value = '';
    document.getElementById('modal-medicine-dropdown').style.display = 'none';
}

function addMedicineToList() {
    if (!currentSelectedMedicine) {
        alert('Please select a medicine first.');
        return;
    }

    const dosage = document.getElementById('medicine-dosage').value;
    const amount = document.getElementById('medicine-amount').value;
    const description = document.getElementById('medicine-description').value;

    if (!dosage || !amount) {
        alert('Please fill in dosage and amount.');
        return;
    }

    const newItem = {
        id: currentSelectedMedicine.medID,
        name: currentSelectedMedicine.genericName,
        brand: currentSelectedMedicine.brand,
        dosage: dosage,
        amount: amount,
        description: description
    };

    selectedMedicines.push(newItem);
    renderSelectedMedicines();
}

function renderSelectedMedicines() {
    const container = document.getElementById('selected-medicines-list');
    container.innerHTML = '';

    selectedMedicines.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'selected-medicine-item';
        div.innerHTML = `
            <div class="medicine-info">
                <strong>${item.name}</strong> 
                <span class="muted">(${item.brand || 'Generic'})</span>
                <br>
                <small>Dosage: ${item.dosage} | Qty: ${item.amount}</small>
                <div class="desc">${item.description}</div>
            </div>
            <button class="remove-btn" type="button">X</button>
        `;

        div.querySelector('.remove-btn').addEventListener('click', () => {
            selectedMedicines.splice(index, 1);
            renderSelectedMedicines();
        });

        container.appendChild(div);
    });
}


function setupFormSubmission() {
    const form = document.getElementById('create-prescription-form');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!currentSelectedClient || !document.getElementById('client-id').value) {
            alert('Please select a client.');
            return;
        }
        if (selectedMedicines.length === 0) {
            alert('Please add at least one medicine.');
            return;
        }

        const formData = new FormData(form);

        selectedMedicines.forEach((med, index) => {
            formData.append(`medicine-${index}-id`, med.id);
            formData.append(`medicine-${index}-dosage`, med.dosage);
            formData.append(`medicine-${index}-amount`, med.amount);
            formData.append(`medicine-${index}-description`, med.description);
        });

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Saving...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                credentials: 'same-origin'
            });
            const result = await response.json();

            if (result.success) {
                alert('Prescription created!');
                window.location.href = './dashboard.php';
            } else {
                alert('Error: ' + (result.error || 'Check inputs'));
                submitBtn.textContent = 'Create Prescription';
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error(error);
            alert('Server error.');
            submitBtn.textContent = 'Create Prescription';
            submitBtn.disabled = false;
        }
    });
}


function setupTemplates() {
    const templateSelect = document.getElementById('load-template');
    if (!templateSelect) return;

    templateSelect.addEventListener('change', (e) => {
        const templateId = e.target.value;
        if (!templateId) return;

        const template = window.currentClientTemplates.find(t => t.templateID == templateId);

        if (template && template.medicines) {
            if (selectedMedicines.length > 0) {
                if (!confirm('Add these template items to your current list?')) return;
            }

            template.medicines.forEach(tm => {
                const realMed = allMedicines.find(m => m.medID == tm.medID);
                selectedMedicines.push({
                    id: tm.medID,
                    name: realMed ? realMed.genericName : 'Unknown',
                    brand: realMed ? realMed.brand : '',
                    dosage: tm.dosage,
                    amount: tm.amount,
                    description: tm.description
                });
            });

            renderSelectedMedicines();
        }
    });

    const saveCheck = document.getElementById('save-template');
    const nameInput = document.getElementById('template-name-container');

    if (saveCheck) {
        saveCheck.addEventListener('change', (e) => {
            nameInput.style.display = e.target.checked ? 'block' : 'none';
        });
    }
}

async function loadTemplatesForClient(clientId) {
    const select = document.getElementById('load-template');
    if (!select) return;

    select.innerHTML = '<option value="">Loading...</option>';
    window.currentClientTemplates = []; // Reset global

    try {
        const response = await fetch(`../../controller/get-templates.php?client_id=${clientId}`);
        const templates = await response.json();

        window.currentClientTemplates = templates;

        select.innerHTML = '<option value="">-- Load Saved Template --</option>';
        if (templates.length === 0) {
            const opt = document.createElement('option');
            opt.textContent = "No saved templates";
            opt.disabled = true;
            select.appendChild(opt);
        } else {
            templates.forEach(t => {
                const opt = document.createElement('option');
                opt.value = t.templateID;
                opt.textContent = t.templateName;
                select.appendChild(opt);
            });
        }
    } catch (e) {
        console.error(e);
        select.innerHTML = '<option>Error loading templates</option>';
    }
}

