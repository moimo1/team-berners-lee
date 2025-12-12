const ADMIN_API_BASE = `${window.location.protocol}//${window.location.hostname}:3000/api/admin`;

let activeFilter = 'all';
let currentItems = [];
let currentSelected = null;
let searchTimeout = null;

document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('[data-filter]');
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setActiveFilter(btn.dataset.filter);
    });
  });

  const searchInput = document.getElementById('search-input');
  const refreshButton = document.getElementById('refresh-list');

  if (refreshButton) {
    refreshButton.addEventListener('click', fetchAndRender);
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      // Clear existing timeout
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      // Debounce search - wait 300ms after user stops typing
      searchTimeout = setTimeout(() => {
        fetchAndRender();
      }, 300);
    });
  }

  // Add User Modal Logic
  const addUserBtn = document.getElementById('add-user-btn');
  const addModal = document.getElementById('add-modal');
  const addForm = document.getElementById('add-form');
  const closeAddBtns = document.querySelectorAll('[data-close-add-modal]');
  const roleSelect = document.getElementById('add-role');

  if (addUserBtn && addModal) {
    addUserBtn.addEventListener('click', () => {
      addModal.classList.add('active'); // CSS based visibility usually
      addModal.style.display = 'flex'; // Fallback
      addModal.setAttribute('aria-hidden', 'false');
    });

    closeAddBtns.forEach(btn => btn.addEventListener('click', () => {
      closeAddModal();
    }));

    if (roleSelect) {
      roleSelect.addEventListener('change', () => {
        updateDynamicFields(roleSelect.value);
      });
    }

    if (addForm) {
      addForm.addEventListener('submit', handleAddUser);
    }
  }

  fetchAndRender();
});

function closeAddModal() {
  const addModal = document.getElementById('add-modal');
  if (addModal) {
    addModal.style.display = 'none';
    addModal.setAttribute('aria-hidden', 'true');
    document.getElementById('add-form').reset();
    document.getElementById('add-status').textContent = '';
    updateDynamicFields('');
  }
}

function updateDynamicFields(role) {
  document.getElementById('add-specialization-field').style.display = role === 'doctor' ? 'block' : 'none';
  document.getElementById('add-location-field').style.display = role === 'pharmacist' ? 'block' : 'none';

  const isClient = role === 'client';
  document.getElementById('add-address-field').style.display = isClient ? 'block' : 'none';
  document.getElementById('add-contact-field').style.display = isClient ? 'block' : 'none';
}

async function handleAddUser(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  const role = data.role;
  const statusEl = document.getElementById('add-status');

  statusEl.textContent = 'Creating user...';
  statusEl.classList.remove('error');

  let endpoint = '';
  if (role === 'doctor') endpoint = 'doctors';
  else if (role === 'client') endpoint = 'patients';
  else if (role === 'pharmacist') endpoint = 'pharmacists';
  else return;

  try {
    const res = await fetch(`${ADMIN_API_BASE}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();

    if (result.success) {
      alert('User created successfully!');
      closeAddModal();
      fetchAndRender();
    } else {
      throw new Error(result.error);
    }
  } catch (err) {
    console.error(err);
    statusEl.textContent = err.message || 'Failed to create user.';
    statusEl.classList.add('error');
  }
}

function setActiveFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  fetchAndRender();
}

async function fetchAndRender() {
  const listEl = document.getElementById('people-list');
  const searchTerm = (document.getElementById('search-input')?.value || '').trim();

  if (listEl) listEl.innerHTML = '<div class="loading-state">Loading data...</div>';

  try {
    const { items, counts } = await loadEntities(activeFilter, searchTerm);
    currentItems = items;
    updateCounts(counts);
    renderList(items);
  } catch (error) {
    console.error(error);
    if (listEl) listEl.innerHTML = '<div class="error-state">Unable to load data. Please ensure the API server is running.</div>';
    updateCounts({ doctor: 0, client: 0, pharmacist: 0 });
    const resultsEl = document.getElementById('results-count');
    if (resultsEl) resultsEl.textContent = 0;
  }
}

async function loadEntities(filter, search) {
  const counts = { doctor: 0, client: 0, pharmacist: 0 };

  if (filter === 'doctor') {
    const doctors = await fetchList('doctors', search);
    counts.doctor = doctors.length;
    const items = normalizeList(doctors, 'doctor');
    items.sort((a, b) => a.name.localeCompare(b.name));
    return { items, counts };
  }

  if (filter === 'client') {
    const clients = await fetchList('patients', search);
    counts.client = clients.length;
    const items = normalizeList(clients, 'client');
    items.sort((a, b) => a.name.localeCompare(b.name));
    return { items, counts };
  }

  if (filter === 'pharmacist') {
    const pharmacists = await fetchList('pharmacists', search);
    counts.pharmacist = pharmacists.length;
    const items = normalizeList(pharmacists, 'pharmacist');
    items.sort((a, b) => a.name.localeCompare(b.name));
    return { items, counts };
  }

  const [doctors, clients, pharmacists] = await Promise.all([
    fetchList('doctors', search),
    fetchList('patients', search),
    fetchList('pharmacists', search),
  ]);

  counts.doctor = doctors.length;
  counts.client = clients.length;
  counts.pharmacist = pharmacists.length;

  const items = [
    ...normalizeList(doctors, 'doctor'),
    ...normalizeList(clients, 'client'),
    ...normalizeList(pharmacists, 'pharmacist'),
  ];

  items.sort((a, b) => a.name.localeCompare(b.name));
  return { items, counts };
}

async function fetchList(path, search) {
  const url = new URL(`${ADMIN_API_BASE}/${path}`);
  if (search) url.searchParams.set('search', search);

  const response = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  const payload = await response.json();
  if (!payload.success) {
    throw new Error(payload.error || 'Request failed');
  }
  return payload.data || [];
}

function normalizeList(data, type) {
  return (data || []).map((row) => {
    const name = formatName(row);
    const email = row.email || 'No email on file';
    const specialization = row.specialization || row.doctorSpecialization || '';
    const address = row.address || row.clientAddress || '';
    const location = row.location || '';

    let subtitle = '';
    if (type === 'doctor') subtitle = specialization || 'Doctor';
    if (type === 'client') subtitle = address || 'Client';
    if (type === 'pharmacist') subtitle = location || 'Pharmacist';

    return {
      id: row.id || row.doctorID || row.clientID || row.pharmaID,
      type,
      name,
      subtitle,
      email,
      specialization,
      address,
      location,
      raw: row,
    };
  });
}

function renderList(items) {
  const listEl = document.getElementById('people-list');
  const resultsEl = document.getElementById('results-count');
  if (!listEl) return;

  if (resultsEl) resultsEl.textContent = items?.length ?? 0;

  if (!items || items.length === 0) {
    listEl.innerHTML = '<div class="empty-state">No records found for this filter.</div>';
    return;
  }

  listEl.innerHTML = '';
  items.forEach((item, index) => {
    const card = document.createElement('article');
    card.className = 'person-card';
    card.innerHTML = `
      <div class="person-avatar" aria-hidden="true">${initials(item.name)}</div>
      <div class="person-info">
        <div class="name-row">
          <h3>${escapeHtml(item.name)}</h3>
          <span class="type-pill type-${item.type}">${labelForType(item.type)}</span>
        </div>
        <p class="subtitle">${escapeHtml(item.subtitle || '—')}</p>
        <p class="meta">${escapeHtml(item.email)}</p>
      </div>
      <div class="person-actions">
        <button class="btn-ghost" data-action="view" data-index="${index}">View Details</button>
      </div>
    `;

    card.addEventListener('click', (event) => {
      const btn = event.target.closest('button[data-action="view"]');
      if (btn) {
        event.stopPropagation();
        const idx = Number(btn.dataset.index);
        const selected = currentItems[idx];
        if (selected) goToDetail(selected);
      }
    });

    listEl.appendChild(card);
  });
}

function goToDetail(item) {
  if (!item) return;
  window.location.href = `/view/admin/detail.php?type=${encodeURIComponent(item.type)}&id=${encodeURIComponent(item.id)}`;
}

function updateCounts() {
  // counts no longer shown
}

function labelForType(type) {
  if (type === 'doctor') return 'Doctor';
  if (type === 'client') return 'Client';
  if (type === 'pharmacist') return 'Pharmacist';
  return 'User';
}

function formatName(person) {
  if (!person) return 'Unknown';
  const name = `${person.firstName || ''} ${person.lastName || ''}`.trim();
  return name || person.username || 'Unknown';
}

function initials(name) {
  if (!name) return '👤';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function escapeHtml(text = '') {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// modal-related helpers removed; navigation handles detail/edit

