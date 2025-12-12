// 1. SETTINGS
const API_URL = 'http://localhost:3000/api/admin';

// 2. WHEN PAGE LOADS
document.addEventListener('DOMContentLoaded', () => {
  console.log('Detail page loaded');

  // Get the "type" (doctor/client) and "id" from the URL
  // Example: detailed.php?type=doctor&id=123
  const params = new URLSearchParams(window.location.search);
  const userType = params.get('type');
  const userId = params.get('id');

  // If something is missing, stop here
  if (!userType || !userId) {
    alert('Missing parameters!');
    return;
  }

  // Save these values in hidden inputs so we can use them later
  document.getElementById('entity-type').value = userType;
  document.getElementById('entity-id').value = userId;

  // Load the user's data
  loadUserDetails(userType, userId);

  // Setup the buttons (Edit, Save, Delete)
  setupButtons(userType, userId);
});


// 3. LOAD USER DATA
async function loadUserDetails(type, id) {
  const statusMsg = document.getElementById('status');
  statusMsg.textContent = 'Loading...';

  // Decide which API endpoint to use
  let endpoint = '';
  if (type === 'doctor') {
    endpoint = 'doctors';
  } else if (type === 'client') {
    endpoint = 'patients'; // API uses 'patients', we use 'client'
  } else if (type === 'pharmacist') {
    endpoint = 'pharmacists';
  }

  try {
    // Fetch data from server
    const response = await fetch(`${API_URL}/${endpoint}/${id}`);
    const result = await response.json();

    if (result.success) {
      // If we got data, show it on the screen
      const userData = result.data;
      showDataOnScreen(type, userData);
      statusMsg.textContent = ''; // Clear loading message
    } else {
      statusMsg.textContent = 'Error: ' + result.error;
    }

  } catch (error) {
    console.error('Error loading details:', error);
    statusMsg.textContent = 'Server Error';
  }
}


// 4. SHOW DATA ON SCREEN
function showDataOnScreen(type, data) {
  // Fill in the common fields (everyone has these)
  document.getElementById('first-name').value = data.firstName || '';
  document.getElementById('last-name').value = data.lastName || '';
  document.getElementById('email').value = data.email || '';

  // Hide special rows first
  document.getElementById('row-specialization').classList.add('hidden');
  document.getElementById('row-address').classList.add('hidden');
  document.getElementById('row-location').classList.add('hidden');

  // Show and fill special fields based on Type
  if (type === 'doctor') {
    // Show Specialization
    document.getElementById('row-specialization').classList.remove('hidden');
    // Fill it (API might call it 'doctorSpecialization' or 'specialization')
    document.getElementById('specialization').value = data.doctorSpecialization || data.specialization || '';
  }
  else if (type === 'client') {
    // Show Address
    document.getElementById('row-address').classList.remove('hidden');
    document.getElementById('address').value = data.clientAddress || data.address || '';
  }
  else if (type === 'pharmacist') {
    // Show Location
    document.getElementById('row-location').classList.remove('hidden');
    document.getElementById('location').value = data.location || '';
  }

  // Ensure fields are locked (read-only) at start
  setFormReadOnly(true);
}


// 5. BUTTON ACTIONS
function setupButtons(type, id) {
  const editBtn = document.getElementById('edit-btn');
  const saveBtn = document.getElementById('save-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const deleteBtn = document.getElementById('delete-btn');

  // EDIT BUTTON
  editBtn.addEventListener('click', () => {
    // Unlock the form
    setFormReadOnly(false);
    document.getElementById('status').textContent = 'Editing enabled.';
  });

  // CANCEL BUTTON
  cancelBtn.addEventListener('click', () => {
    // Reload data to undo changes
    loadUserDetails(type, id);
    document.getElementById('status').textContent = 'Cancelled.';
  });

  // DELETE BUTTON
  deleteBtn.addEventListener('click', async () => {
    const sure = confirm('Are you sure you want to delete this user?');
    if (!sure) return;

    // Determine correct endpoint again (simplest way)
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
        // Go back to dashboard
        window.location.href = '/view/admin/dashboard.php';
      } else {
        alert('Failed to delete: ' + result.error);
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting user.');
    }
  });

  // SAVE BUTTON
  saveBtn.addEventListener('click', async () => {
    const newFirstName = document.getElementById('first-name').value;
    const newLastName = document.getElementById('last-name').value;
    const newEmail = document.getElementById('email').value;

    // Prepare data to send
    const dataToSend = {
      firstName: newFirstName,
      lastName: newLastName,
      email: newEmail
    };

    // Add special fields based on type
    if (type === 'doctor') {
      dataToSend.specialization = document.getElementById('specialization').value;
    } else if (type === 'client') {
      dataToSend.address = document.getElementById('address').value;
    } else if (type === 'pharmacist') {
      dataToSend.location = document.getElementById('location').value;
    }

    // Determine endpoint
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
        setFormReadOnly(true); // Lock form again
      } else {
        document.getElementById('status').textContent = 'Error: ' + result.error;
      }
    } catch (error) {
      console.error(error);
      document.getElementById('status').textContent = 'Error saving.';
    }
  });
}


// 6. HELPER: LOCK/UNLOCK FORM
function setFormReadOnly(isLocked) {
  // List of all input IDs
  const inputs = ['first-name', 'last-name', 'email', 'specialization', 'address', 'location'];

  inputs.forEach(inputId => {
    const element = document.getElementById(inputId);
    if (element) {
      element.readOnly = isLocked;
    }
  });

  // Disable buttons if locked
  document.getElementById('save-btn').disabled = isLocked;
  document.getElementById('cancel-btn').disabled = isLocked;
}



