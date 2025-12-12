const API_URL = `${window.location.protocol}//${window.location.hostname}:3000/api/admin`;

let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded! Starting up...');

  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentFilter = button.dataset.filter;
      console.log('Filter changed to:', currentFilter);
      loadPeople();
    });
  });

  const refreshBtn = document.getElementById('refresh-list');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      console.log('Refresh clicked');
      loadPeople();
    });
  }

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      loadPeople();
    });
  }

  setupAddUserModal();

  loadPeople();
});


async function loadPeople() {
  const listElement = document.getElementById('people-list');
  const searchBox = document.getElementById('search-input');

  const searchText = searchBox ? searchBox.value : '';

  listElement.innerHTML = '<div class="loading-state">Loading...</div>';

  try {
    let allPeople = [];
    if (currentFilter === 'all' || currentFilter === 'doctor') {
      console.log('Fetching doctors...');
      const response = await fetch(`${API_URL}/doctors?search=${searchText}`);
      const result = await response.json();

      const doctors = result.data || [];

      doctors.forEach(doc => {
        doc.type = 'doctor';
        doc.displayName = `${doc.firstName} ${doc.lastName}`;
        doc.displaySubtitle = doc.specialization || 'General Doctor';
      });

      allPeople = allPeople.concat(doctors);
    }

    if (currentFilter === 'all' || currentFilter === 'client') {
      console.log('Fetching clients...');
      const response = await fetch(`${API_URL}/patients?search=${searchText}`);
      const result = await response.json();

      const clients = result.data || [];

      clients.forEach(client => {
        client.type = 'client';
        client.displayName = `${client.firstName} ${client.lastName}`;
        client.displaySubtitle = client.address || 'No Address';
      });

      allPeople = allPeople.concat(clients);
    }

    if (currentFilter === 'all' || currentFilter === 'pharmacist') {
      console.log('Fetching pharmacists...');
      const response = await fetch(`${API_URL}/pharmacists?search=${searchText}`);
      const result = await response.json();

      const pharmacists = result.data || [];

      pharmacists.forEach(pharm => {
        pharm.type = 'pharmacist';
        pharm.displayName = `${pharm.firstName} ${pharm.lastName}`;
        pharm.displaySubtitle = pharm.location || 'No Location';
      });

      allPeople = allPeople.concat(pharmacists);
    }

    allPeople.sort((a, b) => a.displayName.localeCompare(b.displayName));

    const countElement = document.getElementById('results-count');
    if (countElement) {
      countElement.textContent = allPeople.length;
    }

    renderCards(allPeople);

  } catch (error) {
    console.error('Error loading data:', error);
    listElement.innerHTML = '<div class="error-state">Could not load data. check if server is running.</div>';
  }
}


function renderCards(people) {
  const listElement = document.getElementById('people-list');

  listElement.innerHTML = '';

  if (people.length === 0) {
    listElement.innerHTML = '<div class="empty-state">No users found.</div>';
    return;
  }

  people.forEach(person => {
    const card = document.createElement('article');
    card.className = 'person-card';

    card.innerHTML = `
            <div class="person-avatar">${getInitials(person.displayName)}</div>
            
            <div class="person-info">
                <div class="name-row">
                    <h3>${person.displayName}</h3>
                    <span class="type-pill type-${person.type}">${person.type.toUpperCase()}</span>
                </div>
                <p class="subtitle">${person.displaySubtitle}</p>
                <p class="meta">${person.email}</p>
            </div>

            <div class="person-actions">
                <button class="btn-ghost view-btn">View Details</button>
            </div>
        `;

    const viewBtn = card.querySelector('.view-btn');
    viewBtn.addEventListener('click', () => {
      const id = person.id || person.doctorID || person.clientID || person.pharmaID;

      window.location.href = `/view/admin/detail.php?type=${person.type}&id=${id}`;
    });
    listElement.appendChild(card);
  });
}


function getInitials(name) {
  if (!name) return '?';
  const parts = name.split(' ');

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}


function setupAddUserModal() {
  const modal = document.getElementById('add-modal');
  const openBtn = document.getElementById('add-user-btn');
  const closeBtns = document.querySelectorAll('[data-close-add-modal]');
  const form = document.getElementById('add-form');
  const roleSelect = document.getElementById('add-role');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
    });
  }

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  });

  if (roleSelect) {
    roleSelect.addEventListener('change', () => {
      const role = roleSelect.value;
      document.getElementById('add-specialization-field').style.display = 'none';
      document.getElementById('add-address-field').style.display = 'none';
      document.getElementById('add-location-field').style.display = 'none';
      document.getElementById('add-contact-field').style.display = 'none';

      if (role === 'doctor') {
        document.getElementById('add-specialization-field').style.display = 'block';
      } else if (role === 'client') {
        document.getElementById('add-address-field').style.display = 'block';
        document.getElementById('add-contact-field').style.display = 'block';
      } else if (role === 'pharmacist') {
        document.getElementById('add-location-field').style.display = 'block';
      }
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const statusMsg = document.getElementById('add-status');
      statusMsg.textContent = 'Saving...';
      statusMsg.style.color = 'black';

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      let endpoint = '';
      if (data.role === 'doctor') endpoint = 'doctors';
      if (data.role === 'client') endpoint = 'patients';
      if (data.role === 'pharmacist') endpoint = 'pharmacists';

      try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
          alert('User created!');
          modal.style.display = 'none';
          form.reset();
          loadPeople();
          statusMsg.textContent = '';
        } else {
          statusMsg.textContent = 'Error: ' + result.error;
          statusMsg.style.color = 'red';
        }
      } catch (error) {
        console.error(error);
        statusMsg.textContent = 'Network Error';
        statusMsg.style.color = 'red';
      }
    });
  }
}