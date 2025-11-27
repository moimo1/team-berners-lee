const PHARMACISTS_ENDPOINT = '/api/pharma-admin/pharmacists';
const PRESCRIPTIONS_ENDPOINT = '/api/pharma-admin/prescriptions';

document.addEventListener('DOMContentLoaded', () => {
  initSearch();
});

async function initSearch() {
  const pharmacistSelect = document.getElementById('pharmacist');
  const medicineInput = document.getElementById('medicine');
  const clientInput = document.getElementById('client');
  const statusSelect = document.getElementById('status');

  try {
    await populatePharmacists(pharmacistSelect);
  } catch (error) {
    console.error('Unable to load pharmacists', error);
  }

  const applyFilters = () => {
    const filters = {
      pharmacistId: pharmacistSelect.value,
      medicine: medicineInput.value.trim(),
      client: clientInput.value.trim(),
      status: statusSelect.value
    };
    renderSearchResults(filters);
  };

  pharmacistSelect.addEventListener('change', applyFilters);
  statusSelect.addEventListener('change', applyFilters);
  medicineInput.addEventListener('input', debounce(applyFilters, 200));
  clientInput.addEventListener('input', debounce(applyFilters, 200));

  applyFilters();
}

async function populatePharmacists(select) {
  if (!select) return;
  select.innerHTML = '<option value="">Loading pharmacists...</option>';
  const data = await fetchJson(PHARMACISTS_ENDPOINT);
  const pharmacists = data?.pharmacists ?? [];
  select.innerHTML = '<option value="">All pharmacists</option>';
  pharmacists.forEach((pharmacist) => {
    const option = document.createElement('option');
    option.value = pharmacist.pharmaID;
    option.textContent = `${pharmacist.firstName} ${pharmacist.lastName}`;
    select.appendChild(option);
  });
}

async function renderSearchResults(filters) {
  const tbody = document.getElementById('search-results-body');
  const chips = document.getElementById('search-meta-chips');
  const lastUpdated = document.getElementById('search-last-updated');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="5">Searching prescriptions...</td></tr>';

  const params = new URLSearchParams({
    pharmacistId: filters.pharmacistId,
    medicine: filters.medicine,
    client: filters.client,
    status: filters.status
  });

  try {
    const payload = await fetchJson(`${PRESCRIPTIONS_ENDPOINT}?${params.toString()}`);
    const results = payload?.prescriptions ?? [];
    const statusOptions = payload?.meta?.statusOptions ?? [];
    updateStatusFilter(statusOptions, filters.status);

    if (results.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">No prescriptions matched the selected filters.</td></tr>';
    } else {
      tbody.innerHTML = '';
      results.forEach((item) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.prescID}</td>
          <td>${item.pharmacistName ?? 'Unassigned'}</td>
          <td>${item.medicineName ?? '—'}</td>
          <td>${formatClientName(item)}</td>
          <td>${item.status ?? 'Pending'}</td>
        `;
        tbody.appendChild(row);
      });
    }

    updateMetaChips(chips, results.length, filters, payload?.meta);
    if (lastUpdated) {
      const ts = payload?.meta?.generatedAt ? new Date(payload.meta.generatedAt) : new Date();
      lastUpdated.textContent = `Last refreshed ${ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  } catch (error) {
    console.error('Search request failed', error);
    tbody.innerHTML = '<tr><td colspan="5">Unable to load prescriptions. Please try again.</td></tr>';
  }
}

function updateStatusFilter(options, currentValue) {
  const statusSelect = document.getElementById('status');
  if (!statusSelect || !Array.isArray(options) || options.length === 0) return;
  const cached = statusSelect.dataset.cachedOptions;
  const serialized = options.join(',');
  if (cached === serialized) return;

  statusSelect.innerHTML = '<option value="">Any status</option>';
  options.forEach((status) => {
    const option = document.createElement('option');
    option.value = status;
    option.textContent = status;
    statusSelect.appendChild(option);
  });
  statusSelect.value = currentValue || '';
  statusSelect.dataset.cachedOptions = serialized;
}

function updateMetaChips(container, count, filters, meta) {
  if (!container) return;
  container.innerHTML = '';
  const chips = [
    `${count} match${count === 1 ? '' : 'es'}`,
    filters.pharmacistId ? `Pharmacist ${filters.pharmacistId}` : 'All pharmacists',
    filters.status || 'All statuses',
    meta?.sortedBy || 'Sorted by date'
  ];
  chips.forEach((label) => {
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.textContent = label;
    container.appendChild(chip);
  });
}

function formatClientName(item) {
  const first = item.clientFirstName ?? '';
  const last = item.clientLastName ?? '';
  return `${first} ${last}`.trim() || '—';
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

function debounce(fn, wait = 200) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(null, args), wait);
  };
}

