const BASE_URL = 'http://localhost:3000/api/pharma-admin';
const PRESCRIPTIONS_ENDPOINT = `${BASE_URL}/prescriptions`;
const PHARMACISTS_ENDPOINT = `${BASE_URL}/pharmacists`;
const HISTORY_ENDPOINT = (id) => `${BASE_URL}/pharmacists/${id}/history`;

const STATUS_TONES = {
  'Fulfilled': 'status-success',
  'Collected': 'status-success',
  'Ready for Pickup': 'status-success',
  'Insurance Hold': 'status-pending',
  'Requires Review': 'status-delayed',
  'Pending': 'status-pending'
};

let pharmacists = [];
let prescriptions = [];
let selectedPharmacist = null;
let selectedPrescription = null;

document.addEventListener('DOMContentLoaded', () => {
  wireEvents();
  bootstrapData();
});

function wireEvents() {
  const refreshBtn = document.getElementById('refresh-prescriptions');
  const applyBtn = document.getElementById('apply-filters');
  const clearBtn = document.getElementById('clear-filters');

  if (refreshBtn) refreshBtn.addEventListener('click', bootstrapData);
  if (applyBtn) applyBtn.addEventListener('click', loadPrescriptions);
  if (clearBtn) clearBtn.addEventListener('click', () => {
    document.getElementById('pharmacist-filter').value = '';
    document.getElementById('status-filter').value = '';
    document.getElementById('from-date').value = '';
    document.getElementById('to-date').value = '';
    document.getElementById('search-query').value = '';
    selectedPharmacist = null;
    updateHistoryLabel();
    loadPrescriptions();
  });
}

async function bootstrapData() {
  await loadPharmacists();
  await loadPrescriptions();
}

async function loadPharmacists() {
  const select = document.getElementById('pharmacist-filter');
  if (!select) return;

  try {
    const data = await fetchJson(PHARMACISTS_ENDPOINT);
    pharmacists = Array.isArray(data?.pharmacists || data) ? (data.pharmacists || data) : [];
  } catch (error) {
    console.error('Failed to load pharmacists', error);
    pharmacists = getSamplePharmacists();
  }

  select.innerHTML = '<option value="">All pharmacists</option>';
  pharmacists.forEach((pharma) => {
    const option = document.createElement('option');
    option.value = pharma.id || pharma.pharmaID || pharma.pharmacistId || '';
    option.textContent = formatName(pharma);
    select.appendChild(option);
  });
}

async function loadPrescriptions() {
  const tbody = document.getElementById('prescription-table-body');
  const counter = document.getElementById('prescription-count');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#64748b;">Loading prescriptions...</td></tr>';

  const params = new URLSearchParams();
  const pharmacistId = document.getElementById('pharmacist-filter')?.value;
  const status = document.getElementById('status-filter')?.value;
  const from = document.getElementById('from-date')?.value;
  const to = document.getElementById('to-date')?.value;
  const query = document.getElementById('search-query')?.value;

  if (pharmacistId) params.append('pharmacistId', pharmacistId);
  if (status) params.append('status', status);
  if (from) params.append('from', from);
  if (to) params.append('to', to);
  if (query) params.append('q', query.trim());

  try {
    const data = await fetchJson(`${PRESCRIPTIONS_ENDPOINT}?${params.toString()}`);
    prescriptions = Array.isArray(data?.data || data) ? (data.data || data) : [];
  } catch (error) {
    console.error('Failed to load prescriptions', error);
    prescriptions = getSamplePrescriptions();
  }

  renderPrescriptions(prescriptions);

  if (counter) {
    counter.textContent = `${prescriptions.length} ${prescriptions.length === 1 ? 'result' : 'results'}`;
  }
}

function renderPrescriptions(list) {
  const tbody = document.getElementById('prescription-table-body');
  if (!tbody) return;

  if (!Array.isArray(list) || list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#64748b;">No prescriptions found for the selected filters.</td></tr>';
    document.getElementById('prescription-detail-card').innerHTML = '<p class="help-text">Select a prescription to view details.</p>';
    document.getElementById('pharmacist-history-list').innerHTML = '<li><strong>No data</strong><span class="muted">Adjust filters and try again.</span></li>';
    return;
  }

  tbody.innerHTML = '';

  list.forEach((item) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${escapeHtml(item.prescID || item.id || '—')}</td>
      <td>${escapeHtml(item.pharmacistName || formatName(item.pharmacist) || 'Unassigned')}</td>
      <td>${escapeHtml(item.clientName || formatClient(item))}</td>
      <td>${escapeHtml(item.medicineName || summarizeMedicines(item.medicines))}</td>
      <td class="${STATUS_TONES[item.status] || ''}">${escapeHtml(item.status || 'Pending')}</td>
      <td>${formatDate(item.updatedAt || item.createdAt || item.dateGiven)}</td>
      <td><button class="btn btn-secondary btn-small" data-presc="${escapeHtml(item.prescID || item.id || '')}">View</button></td>
    `;

    row.addEventListener('click', (event) => {
      const isButton = event.target && event.target.tagName === 'BUTTON';
      if (isButton) event.stopPropagation();
      selectPrescription(item);
    });

    const actionBtn = row.querySelector('button');
    if (actionBtn) {
      actionBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        selectPrescription(item);
      });
    }

    tbody.appendChild(row);
  });
}

function selectPrescription(prescription) {
  selectedPrescription = prescription;
  renderDetail(prescription);
  const pharmacist = prescription.pharmacist || pharmacists.find(p => matchesPharmacist(p, prescription.pharmacistId));
  selectedPharmacist = pharmacist || null;
  updateHistoryLabel(pharmacist, prescription.pharmacistName);
  if (pharmacist || prescription.pharmacistId) {
    loadHistory(pharmacist?.id || pharmacist?.pharmaID || pharmacist?.pharmacistId || prescription.pharmacistId, pharmacist || { name: prescription.pharmacistName });
  }
}

async function loadHistory(pharmacistId, pharmacistInfo = {}) {
  const list = document.getElementById('pharmacist-history-list');
  if (!list) return;

  if (!pharmacistId) {
    list.innerHTML = '<li><strong>Pick a pharmacist</strong><span class="muted">History will appear here once selected.</span></li>';
    return;
  }

  list.innerHTML = '<li><strong>Loading history...</strong></li>';

  let history = [];
  try {
    const data = await fetchJson(HISTORY_ENDPOINT(pharmacistId));
    history = Array.isArray(data?.history || data) ? (data.history || data) : [];
  } catch (error) {
    console.error('Failed to load history', error);
    history = getSampleHistory(pharmacistInfo);
  }

  if (!history.length) {
    list.innerHTML = '<li><strong>No history found</strong><span class="muted">Try another pharmacist or adjust filters.</span></li>';
    return;
  }

  list.innerHTML = '';
  history.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${escapeHtml(item.title || 'Prescription update')}</strong>
      <span class="muted">${formatDateTime(item.timestamp || item.date)}</span>
      <div class="chips">
        <span class="chip">${escapeHtml(item.status || 'Pending')}</span>
        ${item.client ? `<span class="chip">Client: ${escapeHtml(item.client)}</span>` : ''}
        ${item.medicine ? `<span class="chip">Medicine: ${escapeHtml(item.medicine)}</span>` : ''}
      </div>
    `;
    list.appendChild(li);
  });
}

function renderDetail(prescription) {
  const container = document.getElementById('prescription-detail-card');
  if (!container) return;

  if (!prescription) {
    container.innerHTML = '<p class="help-text">Select a prescription to view details.</p>';
    return;
  }

  const medicines = Array.isArray(prescription.medicines) ? prescription.medicines : [];
  const client = formatClient(prescription);
  const pharmacistName = prescription.pharmacistName || formatName(prescription.pharmacist) || 'Unassigned';

  const medsMarkup = medicines.length
    ? medicines.map((med) => `
        <div class="detail-card">
          <span>Medicine</span>
          <strong>${escapeHtml(med.medicineName || med.name || 'N/A')}</strong>
          <span class="muted">Amount: ${escapeHtml(String(med.amount ?? med.amountRemaining ?? 'N/A'))}</span>
          <span class="muted">Status: ${escapeHtml(med.status || prescription.status || 'Pending')}</span>
        </div>
      `).join('')
    : '<p class="help-text">No medicines listed for this prescription.</p>';

  container.innerHTML = `
    <div class="details-grid">
      <div class="detail-card">
        <span>Prescription ID</span>
        <strong>${escapeHtml(prescription.prescID || prescription.id || '—')}</strong>
        <span class="muted">Status: ${escapeHtml(prescription.status || 'Pending')}</span>
      </div>
      <div class="detail-card">
        <span>Pharmacist</span>
        <strong>${escapeHtml(pharmacistName)}</strong>
        <span class="muted">Last updated ${formatDateTime(prescription.updatedAt || prescription.dateGiven)}</span>
      </div>
      <div class="detail-card">
        <span>Client</span>
        <strong>${escapeHtml(client)}</strong>
        <span class="muted">Given ${formatDate(prescription.dateGiven)}</span>
      </div>
    </div>
    <div class="details-grid">${medsMarkup}</div>
  `;
}

function formatName(person = {}) {
  if (person.name) return person.name;
  return `${person.firstName ?? ''} ${person.lastName ?? ''}`.trim() || '—';
}

function formatClient(item = {}) {
  if (item.clientName) return item.clientName;
  const first = item.clientFirstName ?? item.firstName ?? '';
  const last = item.clientLastName ?? item.lastName ?? '';
  const name = `${first} ${last}`.trim();
  return name || '—';
}

function formatDate(date) {
  if (!date) return '—';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(date) {
  if (!date) return '—';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function summarizeMedicines(meds = []) {
  if (!Array.isArray(meds) || meds.length === 0) return '—';
  if (meds.length === 1) return meds[0].medicineName || meds[0].name || '—';
  return `${meds[0].medicineName || meds[0].name || '—'} +${meds.length - 1} more`;
}

function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = value ?? '';
  return div.innerHTML;
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

function matchesPharmacist(pharmacist, id) {
  return pharmacist.id === id || pharmacist.pharmaID === id || pharmacist.pharmacistId === id;
}

function updateHistoryLabel(pharmacist, fallbackName) {
  const label = document.getElementById('history-pharmacist-label');
  if (!label) return;
  if (!pharmacist && !fallbackName) {
    label.textContent = 'No pharmacist selected';
    return;
    }
  label.textContent = pharmacist ? formatName(pharmacist) : (fallbackName || 'Pharmacist');
}

// Sample data to keep the page demonstrative without a running API
function getSamplePharmacists() {
  return [
    { id: 'PH-101', firstName: 'Aria', lastName: 'Lopez' },
    { id: 'PH-102', firstName: 'Jordan', lastName: 'Nguyen' },
    { id: 'PH-103', firstName: 'Priya', lastName: 'Patel' }
  ];
}

function getSamplePrescriptions() {
  return [
    {
      prescID: 'RX-2001',
      pharmacistId: 'PH-101',
      pharmacistName: 'Aria Lopez',
      clientFirstName: 'Sam',
      clientLastName: 'Wong',
      medicineName: 'Amoxicillin',
      status: 'Ready for Pickup',
      updatedAt: new Date().toISOString(),
      medicines: [{ medicineName: 'Amoxicillin', amount: 14, status: 'Ready for Pickup' }]
    },
    {
      prescID: 'RX-2002',
      pharmacistId: 'PH-102',
      pharmacistName: 'Jordan Nguyen',
      clientFirstName: 'Lena',
      clientLastName: 'Dorsey',
      medicineName: 'Atorvastatin',
      status: 'Fulfilled',
      updatedAt: new Date().toISOString(),
      medicines: [{ medicineName: 'Atorvastatin', amount: 30, status: 'Fulfilled' }]
    }
  ];
}

function getSampleHistory(pharmacistInfo = {}) {
  return [
    {
      title: `${pharmacistInfo.name || formatName(pharmacistInfo)} fulfilled RX-2001`,
      timestamp: new Date().toISOString(),
      status: 'Fulfilled',
      client: 'Sam Wong',
      medicine: 'Amoxicillin'
    },
    {
      title: `${pharmacistInfo.name || formatName(pharmacistInfo)} verified insurance for RX-2002`,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'Ready for Pickup',
      client: 'Lena Dorsey',
      medicine: 'Atorvastatin'
    }
  ];
}

