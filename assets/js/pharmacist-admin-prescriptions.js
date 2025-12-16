
const API_BASE = '/api/pharma-admin';

document.addEventListener('DOMContentLoaded', () => {
  loadPharmacistsDropdown();
  loadPrescriptions();

  document.getElementById('refresh-prescriptions')?.addEventListener('click', loadPrescriptions);
  document.getElementById('apply-filters')?.addEventListener('click', loadPrescriptions);
  document.getElementById('clear-filters')?.addEventListener('click', resetFilters);
});

const getAdminLocation = () => {
  const tag = document.querySelector('meta[name="admin-location"]');
  return tag ? tag.content : '';
}

async function loadPharmacistsDropdown() {
  const select = document.getElementById('pharmacist-filter');
  if (!select) return;

  try {
    const adminLocation = getAdminLocation();
    const url = adminLocation
      ? `${API_BASE}/dashboard?location=${encodeURIComponent(adminLocation)}`
      : `${API_BASE}/dashboard`;

    const result = await fetchJson(url);
    const pharmacists = result.data?.pharmacists || [];

    select.innerHTML = '<option value="">All pharmacists</option>';

    pharmacists.forEach(p => {
      const option = document.createElement('option');
      option.value = p.id;
      option.textContent = `${p.firstName} ${p.lastName}`;
      select.appendChild(option);
    });
  } catch (error) {
    console.warn('Could not load pharmacists for dropdown', error);
  }
}

async function loadPrescriptions() {
  const tbody = document.getElementById('prescription-table-body');
  const countBadge = document.getElementById('prescription-count');

  if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:1rem;">Loading...</td></tr>';

  const filters = {
    location: getAdminLocation(),
    pharmacistId: document.getElementById('pharmacist-filter')?.value,
    status: document.getElementById('status-filter')?.value,
    from: document.getElementById('from-date')?.value,
    to: document.getElementById('to-date')?.value,
    search: document.getElementById('search-query')?.value
  };

  try {
    const params = new URLSearchParams();
    for (const key in filters) {
      if (filters[key]) params.append(key, filters[key]);
    }

    const url = `${API_BASE}/prescriptions?${params.toString()}`;

    let prescriptions = [];
    try {
      const response = await fetchJson(url);
      prescriptions = response.data || [];
    } catch (e) {
      console.warn('Search endpoint not ready, loading recent...', e);
      const dashboardData = await fetchJson(`${API_BASE}/dashboard`);
      prescriptions = dashboardData.data?.recentPrescriptions || [];
    }

    renderTable(prescriptions);
    if (countBadge) countBadge.textContent = `${prescriptions.length} results`;

  } catch (error) {
    console.error('Error loading prescriptions', error);
    if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:red;">Failed to load data. Is the server running?</td></tr>';
  }
}

function renderTable(list) {
  const tbody = document.getElementById('prescription-table-body');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:1rem;">No prescriptions found.</td></tr>';
    return;
  }

  tbody.innerHTML = '';

  list.forEach(item => {
    const row = document.createElement('tr');
    row.style.cursor = 'pointer';

    const statusClass = getStatusClass(item.status);

    row.innerHTML = `
      <td><span class="pill">${item.prescID || item.id}</span></td>
      <td>${item.pharmacistName || 'Unassigned'}</td>
      <td>${item.clientName || item.clientFirstName + ' ' + item.clientLastName}</td>
      <td>${item.medicineName || '—'}</td>
      <td><span class="badge ${statusClass}">${item.status || 'Pending'}</span></td>
      <td>${formatDate(item.dateGiven || item.updatedAt)}</td>
      <td><button class="btn btn-secondary btn-sm" type="button">View</button></td>
    `;

    row.addEventListener('click', () => selectPrescription(item));

    tbody.appendChild(row);
  });
}

function selectPrescription(item) {
  const detailCard = document.getElementById('prescription-detail-card');
  if (detailCard) {
    detailCard.innerHTML = `
      <div class="detail-group">
        <label>Prescription ID</label>
        <div><strong>${item.prescID || item.id}</strong></div>
      </div>
      <div class="detail-group">
        <label>Status</label>
        <div><span class="badge ${getStatusClass(item.status)}">${item.status}</span></div>
      </div>
      <div class="detail-group">
        <label>Client</label>
        <div>${item.clientName || item.clientFirstName + ' ' + item.clientLastName}</div>
      </div>
      <div class="detail-group">
        <label>Medicine</label>
        <div>${item.medicineName || 'See prescription details'}</div>
      </div>
      <div class="detail-group">
        <label>Amount</label>
        <div>${item.amount || '—'}</div>
      </div>
      <div class="detail-group">
        <label>Dosage</label>
        <div>${item.dosage || '—'}</div>
      </div>
      <div class="detail-group">
        <label>Date Given</label>
        <div>${formatDate(item.dateGiven)}</div>
      </div>
    `;
  }

  const historyLabel = document.getElementById('history-pharmacist-label');
  if (historyLabel) {
    historyLabel.textContent = item.pharmacistName
      ? `History for ${item.pharmacistName}`
      : 'Unassigned Prescription';
  }

  loadPharmacistHistory(item.pharmacistName, item.pharmacistId);
}

async function loadPharmacistHistory(pharmacistName, pharmacistId) {
  const list = document.getElementById('pharmacist-history-list');
  if (!list) return;

  if (!pharmacistName || !pharmacistId) {
    list.innerHTML = '<li><strong>Unassigned</strong><span class="muted">This prescription has not been claimed by a pharmacist yet.</span></li>';
    return;
  }

  list.innerHTML = '<li><span class="muted">Loading history...</span></li>';

  try {
    const response = await fetchJson(`${API_BASE}/pharmacists/${pharmacistId}/history`);
    const history = response.data || [];

    if (history.length === 0) {
      list.innerHTML = '<li><strong>No history</strong><span class="muted">No actions recorded for this pharmacist yet.</span></li>';
      return;
    }

    list.innerHTML = history.map(h => `
      <li>
        <strong>${h.type || 'Action'}</strong>
        <span class="muted">${formatDate(h.timestamp)}</span>
        <p>${h.description}</p>
      </li>
    `).join('');

  } catch (error) {
    console.warn('Could not load history', error);
    list.innerHTML = '<li><strong>Error</strong><span class="muted">Failed to load history data.</span></li>';
  }
}

function resetFilters() {
  document.getElementById('pharmacist-filter').value = '';
  document.getElementById('status-filter').value = '';
  document.getElementById('from-date').value = '';
  document.getElementById('to-date').value = '';
  document.getElementById('search-query').value = '';
  loadPrescriptions();
}

// --- Helpers ---

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

function formatDate(dateString) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString();
}

function getStatusClass(status) {
  switch (status) {
    case 'Fulfilled':
    case 'Collected': return 'status-success'; // Green
    case 'Pending': return 'status-pending'; // Yellow/Orange
    case 'Requires Review': return 'status-delayed'; // Red
    default: return '';
  }
}