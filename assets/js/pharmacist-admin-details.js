const DETAILS_PHARMACISTS_ENDPOINT = '/api/pharma-admin/pharmacists';
const DETAILS_PRESCRIPTIONS_ENDPOINT = '/api/pharma-admin/prescriptions';

document.addEventListener('DOMContentLoaded', () => {
  initDetailsView();
});

async function initDetailsView() {
  const pharmacistSelect = document.getElementById('details-pharmacist-filter');
  const prescriptionSelect = document.getElementById('details-prescription-select');
  const notesField = document.getElementById('compliance-notes');

  try {
    await populatePharmacists(pharmacistSelect);
    await populatePrescriptions(prescriptionSelect, pharmacistSelect.value);
    attachEventHandlers(pharmacistSelect, prescriptionSelect, notesField);
    await loadPrescriptionDetails(prescriptionSelect.value);
    hydrateNotes(notesField, prescriptionSelect.value);
  } catch (error) {
    console.error('Failed to initialize prescription details view', error);
    showDetailsError('Unable to load prescription data. Please refresh the page.');
  }
}

function attachEventHandlers(pharmacistSelect, prescriptionSelect, notesField) {
  pharmacistSelect.addEventListener('change', async () => {
    await populatePrescriptions(prescriptionSelect, pharmacistSelect.value);
    await loadPrescriptionDetails(prescriptionSelect.value);
    hydrateNotes(notesField, prescriptionSelect.value);
  });

  prescriptionSelect.addEventListener('change', async () => {
    await loadPrescriptionDetails(prescriptionSelect.value);
    hydrateNotes(notesField, prescriptionSelect.value);
  });

  notesField.addEventListener('input', () => {
    persistNotes(notesField.value, prescriptionSelect.value);
  });
}

async function populatePharmacists(select) {
  if (!select) return;
  select.innerHTML = '<option value="">Loading...</option>';
  const data = await fetchJson(DETAILS_PHARMACISTS_ENDPOINT);
  const pharmacists = data?.pharmacists ?? [];
  if (!pharmacists.length) {
    select.innerHTML = '<option value="">No pharmacists found</option>';
    select.disabled = true;
    return;
  }
  select.innerHTML = '';
  pharmacists.forEach((pharmacist, index) => {
    const option = document.createElement('option');
    option.value = pharmacist.pharmaID;
    option.textContent = `${pharmacist.firstName} ${pharmacist.lastName}`;
    if (index === 0) option.selected = true;
    select.appendChild(option);
  });
}

async function populatePrescriptions(select, pharmacistId) {
  if (!select) return;
  select.innerHTML = '<option value="">Loading prescriptions...</option>';
  const params = new URLSearchParams({ pharmacistId, limit: 25 });
  const data = await fetchJson(`${DETAILS_PRESCRIPTIONS_ENDPOINT}?${params.toString()}`);
  const prescriptions = data?.prescriptions ?? [];
  if (!prescriptions.length) {
    select.innerHTML = '<option value="">No prescriptions found</option>';
    select.disabled = true;
    clearDetailCards();
    return;
  }

  select.disabled = false;
  select.innerHTML = '';
  prescriptions.forEach((prescription, index) => {
    const option = document.createElement('option');
    option.value = prescription.prescID;
    option.textContent = `${prescription.prescID} · ${prescription.medicineName ?? 'Prescription'}`;
    if (index === 0) option.selected = true;
    select.appendChild(option);
  });
}

async function loadPrescriptionDetails(prescID) {
  if (!prescID) {
    clearDetailCards();
    return;
  }
  setDetailsLoading(true);
  try {
    const payload = await fetchJson(`${DETAILS_PRESCRIPTIONS_ENDPOINT}/${prescID}`);
    updatePrescriptionView(payload);
  } catch (error) {
    console.error('Unable to fetch prescription details', error);
    showDetailsError('Unable to fetch prescription details. Please try again.');
  } finally {
    setDetailsLoading(false);
  }
}

function updatePrescriptionView(payload) {
  const prescription = payload?.prescription;
  const medicines = payload?.medicines ?? [];
  const verification = payload?.verification ?? [];

  const pharmacistField = document.getElementById('details-pharmacist');
  const medicineField = document.getElementById('details-medicine');
  const clientField = document.getElementById('details-client');
  const quantityField = document.getElementById('details-quantity');
  const statusField = document.getElementById('details-status');
  const pickupField = document.getElementById('details-pickup-window');
  const notesMeta = document.getElementById('notes-meta');

  if (!prescription) {
    clearDetailCards();
    return;
  }

  const firstMedicine = medicines[0];

  medicineField.textContent = firstMedicine?.medicineName ?? '—';
  quantityField.textContent = firstMedicine?.remainingAmount != null ? `${firstMedicine.remainingAmount} units` : '—';
  clientField.textContent = `${prescription.clientFirstName ?? ''} ${prescription.clientLastName ?? ''}`.trim() || '—';
  pharmacistField.textContent = prescription.pharmacistName ?? 'Unassigned';
  statusField.textContent = prescription.status ?? 'Pending';
  pickupField.textContent = prescription.dateExpiry ?? '—';
  notesMeta.textContent = `${prescription.prescID} • Notes are synced locally for quick reference.`;

  renderVerificationTable(verification);
}

function renderVerificationTable(entries) {
  const verificationBody = document.getElementById('verification-table-body');
  if (!verificationBody) return;
  if (!entries.length) {
    verificationBody.innerHTML = '<tr><td colspan="4">No checklist entries recorded yet.</td></tr>';
    return;
  }

  verificationBody.innerHTML = '';
  entries.forEach((entry) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.step}</td>
      <td>${entry.owner}</td>
      <td>${entry.timestamp}</td>
      <td class="${entry.tone || ''}">${entry.notes}</td>
    `;
    verificationBody.appendChild(row);
  });
}

function clearDetailCards() {
  ['details-medicine', 'details-quantity', 'details-client', 'details-pharmacist', 'details-status', 'details-pickup-window'].forEach((id) => {
    const node = document.getElementById(id);
    if (node) node.textContent = '—';
  });
  const verificationBody = document.getElementById('verification-table-body');
  if (verificationBody) {
    verificationBody.innerHTML = '<tr><td colspan="4">Select a prescription to view the checklist.</td></tr>';
  }
  const notesMeta = document.getElementById('notes-meta');
  if (notesMeta) notesMeta.textContent = 'Select a prescription to leave compliance notes.';
}

function setDetailsLoading(isLoading) {
  const grid = document.getElementById('details-grid');
  if (!grid) return;
  grid.classList.toggle('loading', isLoading);
}

function showDetailsError(message) {
  const verificationBody = document.getElementById('verification-table-body');
  if (verificationBody) {
    verificationBody.innerHTML = `<tr><td colspan="4">${message}</td></tr>`;
  }
}

function persistNotes(value, prescriptionId) {
  if (!prescriptionId) return;
  const storageKey = `pharma-admin-notes-${prescriptionId}`;
  try {
    localStorage.setItem(storageKey, value);
  } catch (err) {
    console.warn('Unable to persist notes:', err);
  }
}

function hydrateNotes(field, prescriptionId) {
  if (!field || !prescriptionId) {
    if (field) field.value = '';
    return;
  }
  const storageKey = `pharma-admin-notes-${prescriptionId}`;
  try {
    field.value = localStorage.getItem(storageKey) || '';
  } catch (err) {
    field.value = '';
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'include',
    headers: { 'Accept': 'application/json' },
    ...options
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

