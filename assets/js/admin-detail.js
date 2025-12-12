const API_URL = `${window.location.protocol}//${window.location.hostname}:3000/api/admin`;
document.addEventListener('DOMContentLoaded', () => {
  console.log('Detail page loaded');

  const params = new URLSearchParams(window.location.search);
  const userType = params.get('type');
  const userId = params.get('id');

  if (!userType || !userId) {
    alert('Missing parameters!');
    return;
  }
  document.getElementById('entity-type').value = userType;
  document.getElementById('entity-id').value = userId;

  loadUserDetails(userType, userId);

  setupButtons(userType, userId);
});

async function loadUserDetails(type, id) {
  const statusMsg = document.getElementById('status');
  statusMsg.textContent = 'Loading...';
  let endpoint = '';
  if (type === 'doctor') {
    endpoint = 'doctors';
  } else if (type === 'client') {
    endpoint = 'patients';
  } else if (type === 'pharmacist') {
    endpoint = 'pharmacists';
  }

  try {
    const response = await fetch(`${API_URL}/${endpoint}/${id}`);
    const result = await response.json();

    if (result.success) {
      const userData = result.data;
      showDataOnScreen(type, userData);
      statusMsg.textContent = '';
    } else {
      statusMsg.textContent = 'Error: ' + result.error;
    }

  } catch (error) {
    console.error('Error loading details:', error);
    statusMsg.textContent = 'Server Error';
  }
}


function showDataOnScreen(type, data) {
  document.getElementById('first-name').value = data.firstName || '';
  document.getElementById('last-name').value = data.lastName || '';
  document.getElementById('email').value = data.email || '';

  document.getElementById('row-specialization').classList.add('hidden');
  document.getElementById('row-address').classList.add('hidden');
  document.getElementById('row-location').classList.add('hidden');

  if (type === 'doctor') {
    document.getElementById('row-specialization').classList.remove('hidden');
    document.getElementById('specialization').value = data.doctorSpecialization || data.specialization || '';
  }
  else if (type === 'client') {
    document.getElementById('row-address').classList.remove('hidden');
    document.getElementById('address').value = data.clientAddress || data.address || '';
  }
  else if (type === 'pharmacist') {
    document.getElementById('row-location').classList.remove('hidden');
    document.getElementById('location').value = data.location || '';
  }

  setFormReadOnly(true);
}


function setupButtons(type, id) {
  const editBtn = document.getElementById('edit-btn');
  const saveBtn = document.getElementById('save-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const deleteBtn = document.getElementById('delete-btn');

  editBtn.addEventListener('click', () => {
    setFormReadOnly(false);
    document.getElementById('status').textContent = 'Editing enabled.';
  });

  cancelBtn.addEventListener('click', () => {
    loadUserDetails(type, id);
    document.getElementById('status').textContent = 'Cancelled.';
  });
  deleteBtn.addEventListener('click', async () => {
    const sure = confirm('Are you sure you want to delete this user?');
    if (!sure) return;

    let endpoint = '';
    if (type === 'doctor') endpoint = 'doctors';
    if (type === 'client') endpoint = 'patients';
    if (type === 'pharmacist') endpoint = 'pharmacists';

    try {
      const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();

      if (result.success) {
        alert('User deleted.');
        window.location.href = '/view/admin/dashboard.php';
      } else {
        alert('Failed to delete: ' + result.error);
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting user.');
    }
  });

  saveBtn.addEventListener('click', async () => {
    const newFirstName = document.getElementById('first-name').value;
    const newLastName = document.getElementById('last-name').value;
    const newEmail = document.getElementById('email').value;
    const dataToSend = {
      firstName: newFirstName,
      lastName: newLastName,
      email: newEmail
    };

    if (type === 'doctor') {
      dataToSend.specialization = document.getElementById('specialization').value;
    } else if (type === 'client') {
      dataToSend.address = document.getElementById('address').value;
    } else if (type === 'pharmacist') {
      dataToSend.location = document.getElementById('location').value;
    }

    let endpoint = '';
    if (type === 'doctor') endpoint = 'doctors';
    if (type === 'client') endpoint = 'patients';
    if (type === 'pharmacist') endpoint = 'pharmacists';

    document.getElementById('status').textContent = 'Saving...';

    try {
      const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      const result = await response.json();

      if (result.success) {
        document.getElementById('status').textContent = 'Saved successfully!';
        setFormReadOnly(true);
      } else {
        document.getElementById('status').textContent = 'Error: ' + result.error;
      }
    } catch (error) {
      console.error(error);
      document.getElementById('status').textContent = 'Error saving.';
    }
  });
}

function setFormReadOnly(isLocked) {
  const inputs = ['first-name', 'last-name', 'email', 'specialization', 'address', 'location'];

  inputs.forEach(inputId => {
    const element = document.getElementById(inputId);
    if (element) {
      element.readOnly = isLocked;
    }
  });

  document.getElementById('save-btn').disabled = isLocked;
  document.getElementById('cancel-btn').disabled = isLocked;
}



