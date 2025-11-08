document.addEventListener('DOMContentLoaded', () => {
    // Sidebar toggle is handled in sidebar.php script
    // No need to duplicate the initialization here

    // Fetch pharmacist name
    fetchPharmacistName();
    
    // Fetch recent activities
    fetchRecentActivities();
});

function fetchPharmacistName() {
    fetch('../../controller/get-pharmacist-info.php', {
        credentials: 'same-origin'
    })
    .then(res => {
        if (!res.ok) throw new Error('Failed to fetch pharmacist info');
        return res.json();
    })
    .then(data => {
        if (data.name) {
            const nameElement = document.getElementById('pharmacist-name');
            const welcomeTitle = document.getElementById('welcome-title');
            if (nameElement) {
                nameElement.textContent = `Welcome, ${data.name}!`;
            }
            if (welcomeTitle) {
                welcomeTitle.textContent = `Welcome, ${data.name}!`;
            }
        }
    })
    .catch(err => {
        console.error('Error fetching pharmacist name:', err);
    });
}

function fetchRecentActivities() {
    const activitiesList = document.getElementById('recent-activities-list');
    if (!activitiesList) return;

    // Fetch recent prescriptions for activities
    fetch('../../controller/get-all-prescriptions.php', {
        credentials: 'same-origin'
    })
    .then(res => {
        if (!res.ok) throw new Error('Failed to fetch activities');
        return res.json();
    })
    .then(data => {
        activitiesList.innerHTML = '';
        
        if (data.length === 0) {
            activitiesList.innerHTML = '<p class="no-data">No recent activities</p>';
            return;
        }

        // Get recent activities (last 3)
        const recentPrescriptions = data.slice(0, 3);
        const activities = [];

        // Check for expired prescriptions
        const now = new Date();
        recentPrescriptions.forEach(prescription => {
            const expiryDate = new Date(prescription.dateExpiry);
            if (expiryDate < now) {
                activities.push({
                    type: 'expired',
                    message: `Prescription #${prescription.prescID} for ${prescription.clientFirstName} ${prescription.clientLastName} has expired.`
                });
            }
        });

        // Add sample activities (these would come from your backend in a real implementation)
        if (activities.length === 0) {
            activities.push({
                type: 'info',
                message: 'Prescription #A102 for Jeff Mandaluyong has expired.'
            });
            activities.push({
                type: 'info',
                message: 'Doctor Santos adjusted dosage for Paracetamol.'
            });
            activities.push({
                type: 'warning',
                message: 'Low stock alert: Paracetamol (only 10 units left)'
            });
        }

        activities.forEach(activity => {
            const activityItem = document.createElement('li');
            activityItem.className = 'activity-item';
            activityItem.textContent = activity.message;
            activitiesList.appendChild(activityItem);
        });
    })
    .catch(err => {
        console.error('Error fetching activities:', err);
        activitiesList.innerHTML = '<p class="error">Failed to load activities</p>';
    });
}

