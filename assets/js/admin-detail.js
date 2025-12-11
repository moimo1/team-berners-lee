const ADMIN_API_BASE = `${window.location.protocol}//${window.location.hostname}:3000/api/admin`;

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type');
  const id = params.get('id');

  if (!type || !id || !['doctor', 'client', 'pharmacist'].includes(type)) {
    renderStatus('Missing or invalid parameters.', true);
    return;
  }

  document.getElementById('entity-type').value = type;
  document.getElementById('entity-id').value = id;

  document.getElementById('edit-btn').addEventListener('click', enableEditing);
  document.getElementById('cancel-btn').addEventListener('click', cancelEditing);
  document.getElementById('save-btn').addEventListener('click', saveEdits);

  loadEntity(type, id);
});

function mapPath(type) {
  if (type === 'doctor') return 'doctors';
  if (type === 'client') return 'patients';
  return 'pharmacists';
}

async function loadEntity(type, id) {
  renderStatus('Loading...');
  try {
    const res = await fetch(`${ADMIN_API_BASE}/${mapPath(type)}/${id}`, {
      headers: { Accept: 'application/json' },
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || `Failed (${res.status})`);
    fillFields(type, data.data);
    renderStatus('');
  } catch (err) {
    console.error(err);
    renderStatus('Unable to load details. Please ensure the API server is running.', true);
  }
}

function fillFields(type, payload) {
  const firstName = payload.firstName || '';
  const lastName = payload.lastName || '';
  const email = payload.email || '';
  const specialization = payload.doctorSpecialization || payload.specialization || '';
  const address = payload.clientAddress || payload.address || '';
  const location = payload.location || '';

  document.getElementById('first-name').value = firstName;
  document.getElementById('last-name').value = lastName;
  document.getElementById('email').value = email;

  const specRow = document.getElementById('row-specialization');
  const addressRow = document.getElementById('row-address');
  const locationRow = document.getElementById('row-location');

  specRow.classList.toggle('hidden', type !== 'doctor');
  addressRow.classList.toggle('hidden', type !== 'client');
  locationRow.classList.toggle('hidden', type !== 'pharmacist');

  document.getElementById('specialization').value = specialization;
  document.getElementById('address').value = address;
  document.getElementById('location').value = location;

  setReadOnly(true);
}

function setReadOnly(isReadOnly) {
  ['first-name', 'last-name', 'email', 'specialization', 'address', 'location'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.readOnly = isReadOnly;
  });
  document.getElementById('save-btn').disabled = isReadOnly;
  document.getElementById('cancel-btn').disabled = isReadOnly;
}

function enableEditing() {
  setReadOnly(false);
  renderStatus('Editing enabled.');
}

function cancelEditing() {
  const type = document.getElementById('entity-type').value;
  const id = document.getElementById('entity-id').value;
  loadEntity(type, id);
}

async function saveEdits() {
  const type = document.getElementById('entity-type').value;
  const id = document.getElementById('entity-id').value;

  const payload = {
    firstName: document.getElementById('first-name').value,
    lastName: document.getElementById('last-name').value,
    email: document.getElementById('email').value,
  };

  if (type === 'doctor') payload.specialization = document.getElementById('specialization').value;
  if (type === 'client') payload.address = document.getElementById('address').value;
  if (type === 'pharmacist') payload.location = document.getElementById('location').value;

  renderStatus('Saving...');
  try {
    const res = await fetch(`${ADMIN_API_BASE}/${mapPath(type)}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || `Failed (${res.status})`);
    renderStatus('Saved successfully.');
    setReadOnly(true);
  } catch (err) {
    console.error(err);
    renderStatus('Error saving. Please try again.', true);
  }
}

function renderStatus(message, isError = false) {
  const el = document.getElementById('status');
  if (!el) return;
  el.textContent = message || '';
  el.classList.toggle('error', !!isError);
}


