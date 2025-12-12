// 1. SETTINGS
// This is the address of our Node.js API server
const API_URL = 'http://localhost:3000/api/admin';

// This variable remembers which filter button is currently active ('all', 'doctor', 'client', or 'pharmacist')
let currentFilter = 'all';

// 2. WHEN THE PAGE LOADS
// This code runs as soon as the HTML is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded! Starting up...');

  // A. Setup Filter Buttons (All, Doctor, Client, Pharmacist)
  const filterButtons = document.querySelectorAll('.filter-btn');

  // Loop through each button and add a click event
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 1. Remove 'active' class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));

      // 2. Add 'active' class to the clicked button
      button.classList.add('active');

      // 3. Update our current filter variable
      currentFilter = button.dataset.filter;
      console.log('Filter changed to:', currentFilter);

      // 4. Reload the list
      loadPeople();
    });
  });

  // B. Setup Refresh Button
  const refreshBtn = document.getElementById('refresh-list');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      console.log('Refresh clicked');
      loadPeople();
    });
  }

  // C. Setup Search Box
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      // Reload the list whenever the user types something
      loadPeople();
    });
  }

  // D. Setup "Add User" Modal
  // This connects the "+ Add User" button to the form
  setupAddUserModal();

  // E. Finally, load the initial data
  loadPeople();
});


// 3. MAIN FUNCTION: LOAD PEOPLE
// This function decides what data to fetch based on the current filter
async function loadPeople() {
  const listElement = document.getElementById('people-list');
  const searchBox = document.getElementById('search-input');

  // Get the text from the search box (if any)
  const searchText = searchBox ? searchBox.value : '';

  // Show a loading message
  listElement.innerHTML = '<div class="loading-state">Loading...</div>';

  try {
    // We will store all our people in this list
    let allPeople = [];

    // CASE 1: Logic for DOCTORS
    if (currentFilter === 'all' || currentFilter === 'doctor') {
      console.log('Fetching doctors...');
      const response = await fetch(`${API_URL}/doctors?search=${searchText}`);
      const result = await response.json();

      // The API returns an object like { success: true, data: [...] }
      // So we need to access result.data
      const doctors = result.data || [];

      // Add a "type" property to each doctor so we know what they are later
      doctors.forEach(doc => {
        doc.type = 'doctor';
        doc.displayName = `${doc.firstName} ${doc.lastName}`; // Create a full name
        doc.displaySubtitle = doc.specialization || 'General Doctor'; // Show their job
      });

      // Add them to our main list
      allPeople = allPeople.concat(doctors);
    }

    // CASE 2: Logic for CLIENTS (Patients)
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

    // CASE 3: Logic for PHARMACISTS
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

    // Sort the list alphabetically by name
    allPeople.sort((a, b) => a.displayName.localeCompare(b.displayName));

    // Update the "results count" number at the top
    const countElement = document.getElementById('results-count');
    if (countElement) {
      countElement.textContent = allPeople.length;
    }

    // Finally, draw the cards on the screen
    renderCards(allPeople);

  } catch (error) {
    // If something goes wrong (like server is down), show an error
    console.error('Error loading data:', error);
    listElement.innerHTML = '<div class="error-state">Could not load data. check if server is running.</div>';
  }
}


// 4. DRAWING THE CARDS
// This function takes a list of people and creates HTML for them
function renderCards(people) {
  const listElement = document.getElementById('people-list');

  // Clear the current list
  listElement.innerHTML = '';

  // If nobody was found, show a message
  if (people.length === 0) {
    listElement.innerHTML = '<div class="empty-state">No users found.</div>';
    return;
  }

  // Loop through each person and create a card
  people.forEach(person => {
    // Create the card container
    const card = document.createElement('article');
    card.className = 'person-card';

    // We use backticks (`) to write HTML inside JavaScript
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

    // Add a click listener to the "View Details" button
    const viewBtn = card.querySelector('.view-btn');
    viewBtn.addEventListener('click', () => {
      // When clicked, go to the detail page
      // We pass the ID and Type in the URL so the next page knows what to load

      // The ID field is different for each table, so we check which one exists
      const id = person.id || person.doctorID || person.clientID || person.pharmaID;

      window.location.href = `/view/admin/detail.php?type=${person.type}&id=${id}`;
    });

    // Add the card to the page
    listElement.appendChild(card);
  });
}


// 5. HELPER: GET INITIALS
// Turns "John Doe" into "JD"
function getInitials(name) {
  if (!name) return '?';
  const parts = name.split(' ');

  // If only one name (e.g. "Admin")
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  // If first and last name
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}


// 6. MODAL LOGIC (ADD USER)
// Everything related to the "Add User" popup
function setupAddUserModal() {
  const modal = document.getElementById('add-modal');
  const openBtn = document.getElementById('add-user-btn');
  const closeBtns = document.querySelectorAll('[data-close-add-modal]');
  const form = document.getElementById('add-form');
  const roleSelect = document.getElementById('add-role');

  // Open Modal
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
    });
  }

  // Close Modal (for all close buttons)
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  });

  // Handle Role Change (Show/Hide special fields)
  if (roleSelect) {
    roleSelect.addEventListener('change', () => {
      const role = roleSelect.value;

      // Hide everything first
      document.getElementById('add-specialization-field').style.display = 'none';
      document.getElementById('add-address-field').style.display = 'none';
      document.getElementById('add-location-field').style.display = 'none';
      document.getElementById('add-contact-field').style.display = 'none';

      // Show only what's needed
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

  // Handle Form Submit
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // Stop page refresh

      const statusMsg = document.getElementById('add-status');
      statusMsg.textContent = 'Saving...';
      statusMsg.style.color = 'black';

      // Collect form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Decide where to send data based on role
      let endpoint = '';
      if (data.role === 'doctor') endpoint = 'doctors';
      if (data.role === 'client') endpoint = 'patients';
      if (data.role === 'pharmacist') endpoint = 'pharmacists';

      try {
        // Send data to server
        const response = await fetch(`${API_URL}/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
          alert('User created!');
          modal.style.display = 'none'; // Close modal
          form.reset(); // Clear form
          loadPeople(); // Refresh list to show new user
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