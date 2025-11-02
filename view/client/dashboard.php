<?php
    session_start();
    $role = 'client';
    include '../../includes/navbar.php';
    
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Client Dashboard</title>

    <link rel="stylesheet" href="../../assets/css/client/dashboard.css">
    <link rel="stylesheet" href="../../assets/css/navbar.css">
</head>

<body class="has-sidebar">
    <main class="client-dashboard" id="clientDashboard">
        <aside class="sidebar" aria-label="Sidebar navigation">
            <div class="sidebar-brand">LOGO NAME</div>
            <nav class="sidebar-nav">
                <ul>
                    <li><a href="/view/client/dashboard.php" class="nav-item" aria-label="Home"><span class="icon" aria-hidden="true"><img src="../../assets/icons/home.svg" alt=""></span><span class="label">Home</span></a></li>
                    <li><a href="/view/client/prescription-details.php" class="nav-item" aria-label="My Prescription"><span class="icon" aria-hidden="true"><img src="../../assets/icons/prescription.svg" alt=""></span><span class="label">My Prescription</span></a></li>
                    <li><a href="/view/client/prescription-history.php" class="nav-item" aria-label="Prescription History"><span class="icon" aria-hidden="true"><img src="../../assets/icons/history.svg" alt=""></span><span class="label">Prescription History</span></a></li>
                    <li><a href="/view/client/search-medicine.php" class="nav-item" aria-label="Search"><span class="icon" aria-hidden="true"><img src="../../assets/icons/search.svg" alt=""></span><span class="label">Search</span></a></li>
                </ul>
            </nav>
            <button class="sidebar-toggle" id="sidebarToggle" aria-label="Toggle sidebar" aria-expanded="false"></button>
            <div class="sidebar-footer">
                <ul>
                    <li><a href="#" class="nav-item" aria-label="Profile"><span class="icon" aria-hidden="true"><img src="../../assets/icons/profile.svg" alt=""></span><span class="label">Profile</span></a></li>
                    <li><a href="/logout.php" class="nav-item" aria-label="Logout"><span class="icon" aria-hidden="true"><img src="../../assets/icons/logout.svg" alt=""></span><span class="label">Logout</span></a></li>
                </ul>
            </div>
        </aside>

        <section class="item main-content">
            <h2>Welcome, <?php echo isset($_SESSION['client_name']) ? htmlspecialchars($_SESSION['client_name']) : 'Client'; ?>!</h2>

            <div class="card info-card">
                <div class="info-content">
                    <p>View your prescriptions, refill requests, and medication details here.</p>
                    <a href="./prescription-history.php" class="view-prescriptions-btn">View Your Prescriptions</a>
                </div>
            </div>

            <div class="card recent-prescriptions-card">
                <h3>Recent Prescriptions</h3>
                <div id="recent-prescriptions-list" class="prescriptions-list">
                    <p class="loading">Loading prescriptions...</p>
                </div>
            </div>
        </section>
    </main>

    <script>
    (function(){
        var dashboard = document.getElementById('clientDashboard');
        var toggle = document.getElementById('sidebarToggle');
        if (dashboard && toggle) {
            toggle.addEventListener('click', function(){
                dashboard.classList.toggle('sidebar-expanded');
                var expanded = dashboard.classList.contains('sidebar-expanded');
                toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            });
        }

        // Load recent prescriptions using existing get-prescription-history endpoint
        var prescriptionsList = document.getElementById('recent-prescriptions-list');
        if (prescriptionsList) {
            fetch('../../controller/get-prescription-history.php', { credentials: 'same-origin' })
                .then(async res => {
                    if (res.status === 401) {
                        prescriptionsList.innerHTML = '<p class="error">Please log in to view prescriptions.</p>';
                        return null;
                    }
                    
                    var contentType = res.headers.get('content-type');
                    if (!contentType || !contentType.includes('application/json')) {
                        prescriptionsList.innerHTML = '<p class="error">Invalid response format.</p>';
                        return null;
                    }
                    
                    if (!res.ok) {
                        prescriptionsList.innerHTML = '<p class="no-data">No recent prescriptions found.</p>';
                        return null;
                    }
                    
                    try {
                        return await res.json();
                    } catch (e) {
                        prescriptionsList.innerHTML = '<p class="error">Error parsing response.</p>';
                        return null;
                    }
                })
                .then(data => {
                    if (data === null || data === undefined) return;
                    
                    // Check if response contains an error
                    if (data.error) {
                        prescriptionsList.innerHTML = '<p class="error">' + (data.message || data.error) + '</p>';
                        return;
                    }
                    
                    prescriptionsList.innerHTML = '';

                    // Handle both array and empty object responses
                    if (!Array.isArray(data)) {
                        if (data && typeof data === 'object' && Object.keys(data).length === 0) {
                            prescriptionsList.innerHTML = '<p class="no-data">No recent prescriptions found.</p>';
                        } else {
                            prescriptionsList.innerHTML = '<p class="no-data">No recent prescriptions found.</p>';
                        }
                        return;
                    }

                    if (data.length === 0) {
                        prescriptionsList.innerHTML = '<p class="no-data">No recent prescriptions found.</p>';
                        return;
                    }

                    // Limit to 5 most recent
                    var recent = data.slice(0, 5);
                    recent.forEach(prescription => {
                        var item = document.createElement('div');
                        item.className = 'prescription-item';
                        
                        // Handle date parsing more safely
                        var dateGiven = null;
                        var dateExpiry = null;
                        try {
                            if (prescription.dateGiven) {
                                dateGiven = new Date(prescription.dateGiven);
                                if (isNaN(dateGiven.getTime())) dateGiven = null;
                            }
                            if (prescription.dateExpiry) {
                                dateExpiry = new Date(prescription.dateExpiry);
                                if (isNaN(dateExpiry.getTime())) dateExpiry = null;
                            }
                        } catch (e) {
                            // Date parsing failed, leave as null
                        }
                        
                        var doctorName = (prescription.firstName || '') + ' ' + (prescription.lastName || '');
                        doctorName = doctorName.trim();
                        
                        item.innerHTML = `
                            <div class="prescription-date">${dateGiven ? dateGiven.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</div>
                            <div class="prescription-info">
                                <div class="prescription-doctor">Dr. ${doctorName || 'Unknown'}</div>
                                <div class="prescription-expiry">Expires: ${dateExpiry ? dateExpiry.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</div>
                            </div>
                        `;
                        prescriptionsList.appendChild(item);
                    });
                })
                .catch(err => {
                    console.error('Error loading prescriptions:', err);
                    prescriptionsList.innerHTML = '<p class="error">Error loading prescriptions. Please try again later.</p>';
                });
        }
    })();
    </script>

    <?php include '../../includes/footer.php'; ?>

    <script src="../../assets/js/get-prescription.js"></script>
</body>

</html>
