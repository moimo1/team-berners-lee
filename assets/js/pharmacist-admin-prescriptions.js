/* assets/js/pharmacist-admin-prescriptions.js */

const API_BASE = 'http://localhost:3000/api/pharma-admin';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial Load
  loadPharmacistsDropdown();
  loadPrescriptions();

  // 2. Event Listeners
  document.getElementById('refresh-prescriptions')?.addEventListener('click', loadPrescriptions);
  document.getElementById('apply-filters')?.addEventListener('click', loadPrescriptions);
  document.getElementById('clear-filters')?.addEventListener('click', resetFilters);
});

// --- Core Data Loading Functions ---

async function loadPharmacistsDropdown() {
  const select = document.getElementById('pharmacist-filter');
  if (!select) return;

  try {
    // Assuming you have an endpoint that lists pharmacists
    // If not, it will just keep the default option
    const result = await fetchJson(`${API_BASE}/dashboard`); // Reusing dashboard endpoint for simplicity to get list
    const pharmacists = result.data?.pharmacists || [];

    // Keep the first "All pharmacists" option
    select.innerHTML = '<option value="">All pharmacists</option>';

    pharmacists.forEach(p => {
      const option = document.createElement('option');
      option.value = p.id; // Assuming ID is 'id' or 'pharmaID'
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

  // 1. Gather Filter Values
  const filters = {
    pharmacistId: document.getElementById('pharmacist-filter')?.value,
    status: document.getElementById('status-filter')?.value,
    from: document.getElementById('from-date')?.value,
    to: document.getElementById('to-date')?.value,
    search: document.getElementById('search-query')?.value
  };

  try {
    // 2. Build Query String
    const params = new URLSearchParams();
    for (const key in filters) {
      if (filters[key]) params.append(key, filters[key]);
    }

    // 3. Fetch Data
    // Note: You will need to implement this specific route in your Node backend
    // For now, we simulate the fetch or use the existing dashboard/recent if specific search isn't built
    const url = `${API_BASE}/prescriptions?${params.toString()}`;
    
    // Fallback: If the search endpoint doesn't exist yet, we catch the error 
    // and just use the dashboard's "recent" list for demonstration.
    let prescriptions = [];
    try {
      const response = await fetchJson(url);
      prescriptions = response.data || [];
    } catch (e) {
      console.warn('Search endpoint not ready, loading recent...', e);
      const dashboardData = await fetchJson(`${API_BASE}/dashboard`);
      prescriptions = dashboardData.data?.recentPrescriptions || [];
    }

    // 4. Render
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
    row.style.cursor = 'pointer'; // Make it look clickable
    
    // Status color mapping
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

    // Click handler for the whole row
    row.addEventListener('click', () => selectPrescription(item));
    
    tbody.appendChild(row);
  });
}

// --- Interaction Functions ---

function selectPrescription(item) {
  // 1. Populate Details Card
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
        <label>Date Given</label>
        <div>${formatDate(item.dateGiven)}</div>
      </div>
    `;
  }

  // 2. Update History Section Header
  const historyLabel = document.getElementById('history-pharmacist-label');
  if (historyLabel) {
    historyLabel.textContent = item.pharmacistName 
      ? `History for ${item.pharmacistName}` 
      : 'Unassigned Prescription';
  }

  // 3. Populate History List (Mocking logic here, or fetch specific API)
  loadPharmacistHistory(item.pharmacistName, item.prescID);
}

function loadPharmacistHistory(pharmacistName, prescId) {
  const list = document.getElementById('pharmacist-history-list');
  if (!list) return;

  if (!pharmacistName) {
    list.innerHTML = '<li><strong>Unassigned</strong><span class="muted">This prescription has not been claimed by a pharmacist yet.</span></li>';
    return;
  }

  // NOTE: In a real app, you would fetch: GET /api/pharma-admin/pharmacists/:id/history
  // Here we display a simulated history entry for immediate feedback
  list.innerHTML = `
    <li>
      <strong>Most Recent Action</strong>
      <span class="muted">Just now</span>
      <p>Loaded details for prescription <strong>${prescId}</strong>.</p>
    </li>
    <li>
      <strong>${pharmacistName}</strong>
      <span class="muted">Assignment</span>
      <p>Pharmacist assigned to this order.</p>
    </li>
  `;
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