const DASHBOARD_ENDPOINT = `${window.location.protocol}//${window.location.hostname}:3000/api/pharma-admin/dashboard`;

const STATUS_TONES = {
  'Fulfilled': 'status-success',
  'Collected': 'status-success',
  'Ready for Pickup': 'status-success',
  'Insurance Hold': 'status-pending',
  'Requires Review': 'status-delayed',
  'Pending': 'status-pending'
};

document.addEventListener('DOMContentLoaded', () => {
  hydrateDashboard();

  const refreshBtn = document.getElementById('refresh-dashboard');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', hydrateDashboard);
  }
});

async function hydrateDashboard() {
  const pulseContainer = document.getElementById('team-pulse-cards');
  const pharmaContainer = document.getElementById('pharmacist-overview-body');
  const prescContainer = document.getElementById('recent-prescriptions-body');

  if (pulseContainer) pulseContainer.innerHTML = '<p class="help-text">Loading metrics...</p>';
  if (pharmaContainer) pharmaContainer.innerHTML = '<tr><td colspan="2">Loading data...</td></tr>';
  if (prescContainer) prescContainer.innerHTML = '<tr><td colspan="5">Loading data...</td></tr>';

  // Get admin location from meta tag
  const adminLocationTag = document.querySelector('meta[name="admin-location"]');
  const adminLocation = adminLocationTag ? adminLocationTag.content : '';

  try {
    const url = adminLocation
      ? `${DASHBOARD_ENDPOINT}?location=${encodeURIComponent(adminLocation)}`
      : DASHBOARD_ENDPOINT;

    const response = await fetchJson(url);

    const payload = response.data;

    renderPulse(payload.stats);
    renderPharmacistOverview(payload.pharmacists);
    renderRecentPrescriptions(payload.recentPrescriptions);

  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    if (pulseContainer) pulseContainer.innerHTML = '<p class="error-text">Unable to connect to server.</p>';
    if (pharmaContainer) pharmaContainer.innerHTML = '<tr><td colspan="2">Connection failed.</td></tr>';
    if (prescContainer) prescContainer.innerHTML = '<tr><td colspan="5">Connection failed.</td></tr>';
  }
}

function renderPulse(stats) {
  const container = document.getElementById('team-pulse-cards');
  if (!container) return;

  if (!stats) {
    container.innerHTML = '<p class="help-text">No stats available.</p>';
    return;
  }

  const cards = [
    {
      label: 'Prescriptions Completed',
      value: stats.completed ?? 0,
      badge: 'Fulfilled orders'
    },
    {
      label: 'Pending Approvals',
      value: stats.pending ?? 0,
      badge: 'Awaiting action'
    },
    {
      label: 'Escalations',
      value: stats.escalations ?? 0,
      badge: 'Needs manager review'
    }
  ];

  container.innerHTML = '';
  cards.forEach((metric) => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `
      <div style="background:#fff; padding:1.5rem; border:1px solid #ddd; border-radius:8px;">
        <h4 style="margin:0; font-size:0.85rem; color:#666; text-transform:uppercase;">${metric.label}</h4>
        <div style="font-size:2rem; font-weight:bold; margin:0.5rem 0;">${metric.value}</div>
        <div style="font-size:0.85rem; color:#888;">${metric.badge}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderPharmacistOverview(pharmacists = []) {
  const tbody = document.getElementById('pharmacist-overview-body');
  if (!tbody) return;

  if (!Array.isArray(pharmacists) || pharmacists.length === 0) {
    tbody.innerHTML = '<tr><td colspan="2">No pharmacists found.</td></tr>';
    return;
  }

  tbody.innerHTML = '';
  pharmacists.forEach((pharmacist) => {
    const statusClass = 'on-track';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${formatName(pharmacist)}</strong></td>
      <td>
        <span class="status-indicator ${statusClass}" style="display:inline-block; width:8px; height:8px; background:green; border-radius:50%; margin-right:5px;"></span>
        ${pharmacist.handled ?? 0} prescriptions
      </td>
    `;
    tbody.appendChild(row);
  });
}

function renderRecentPrescriptions(prescriptions = []) {
  const tbody = document.getElementById('recent-prescriptions-body');
  if (!tbody) return;

  if (!Array.isArray(prescriptions) || prescriptions.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">No recent prescriptions.</td></tr>';
    return;
  }

  tbody.innerHTML = '';
  prescriptions.forEach((prescription) => {
    const client = prescription.clientName || `${prescription.clientFirstName ?? ''} ${prescription.clientLastName ?? ''}`.trim() || '—';
    const statusTone = STATUS_TONES[prescription.status] || '';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${prescription.prescID}</td>
      <td>${prescription.medicineName ?? '—'}</td>
      <td>${client}</td>
      <td>${prescription.pharmacistName ?? 'Unassigned'}</td>
      <td class="${statusTone}">${prescription.status ?? 'Pending'}</td>
    `;
    tbody.appendChild(row);
  });
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' },
    ...options
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

function formatName(person) {
  if (!person) return '—';
  const name = `${person.firstName ?? ''} ${person.lastName ?? ''}`.trim();
  return name || '—';
}