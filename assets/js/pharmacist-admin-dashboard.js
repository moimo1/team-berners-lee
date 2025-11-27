const DASHBOARD_ENDPOINT = 'http://localhost:3000/api/pharma-admin/dashboard';
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
});

async function hydrateDashboard() {
  try {
    const payload = await fetchJson(DASHBOARD_ENDPOINT);
    renderPulse(payload?.stats);
    renderPharmacistOverview(payload?.pharmacists);
    renderRecentPrescriptions(payload?.recentPrescriptions);
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    renderPulse();
    renderPharmacistOverview();
    renderRecentPrescriptions();
  }
}

function renderPulse(stats) {
  const container = document.getElementById('team-pulse-cards');
  if (!container) return;

  const cards = [
    {
      label: 'Prescriptions Completed',
      value: stats?.completed ?? '—',
      badge: 'Live count of fulfilled and collected orders'
    },
    {
      label: 'Pending Approvals',
      value: stats?.pending ?? '—',
      badge: 'Awaiting pharmacist action'
    },
    {
      label: 'Escalations',
      value: stats?.escalations ?? '—',
      badge: 'Items needing manager review'
    }
  ];

  if (!stats) {
    container.innerHTML = '<p class="help-text">Unable to load live metrics.</p>';
    return;
  }

  container.innerHTML = '';
  cards.forEach((metric) => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `
      <h4>${metric.label}</h4>
      <div class="stat-value">${metric.value}</div>
      <div class="badge">${metric.badge}</div>
    `;
    container.appendChild(card);
  });
}

function renderPharmacistOverview(pharmacists = []) {
  const tbody = document.getElementById('pharmacist-overview-body');
  if (!tbody) return;

  if (!Array.isArray(pharmacists) || pharmacists.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3">No pharmacists found.</td></tr>';
    return;
  }

  tbody.innerHTML = '';
  pharmacists.forEach((pharmacist) => {

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${formatName(pharmacist)}</td>
      <td>${pharmacist.handled ?? 0} prescriptions</td>
      <!-- [REMOVED] The <td> for Pending -->
      <td>${pharmacist.shift ?? pharmacist.location ?? '—'}</td>
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
    const client = `${prescription.clientFirstName ?? ''} ${prescription.clientLastName ?? ''}`.trim() || '—';
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
    credentials: 'include',
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
  if (person.name) return person.name;
  const name = `${person.firstName ?? ''} ${person.lastName ?? ''}`.trim();
  return name || '—';
}
