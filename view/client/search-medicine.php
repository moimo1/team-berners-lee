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
    <title>Search Drug Info</title>
    <link rel="stylesheet" href="../../assets/css/client/dashboard.css">
    <link rel="stylesheet" href="../../assets/css/client/search-medicine.css">
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
            <h2 class="page-title">Search Drug Info</h2>
            
            <div class="card search-container">
                <form id="search-form" class="search-form">
                    <div class="search-input-group">
                        <select id="search-type" class="search-dropdown" aria-label="Search by">
                            <option value="genericName">Search by Generic Name</option>
                            <option value="brand">Search by Brand Name</option>
                        </select>
                        <input 
                            type="text" 
                            id="drug-name-input" 
                            name="query" 
                            placeholder="Enter Drug Name Here" 
                            class="search-input"
                            required
                        />
                        <button type="submit" class="search-btn" aria-label="Search">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M19 19L14.65 14.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>

            <div class="card results-container">
                <div class="results-header">
                    <h3>Search Results</h3>
                </div>
                <div id="search-results" class="search-results">
                    <p class="no-results">Enter a drug name and click search to find medicine information.</p>
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
    })();
    </script>

    <?php include '../../includes/footer.php'; ?>

    <script src="../../assets/js/search-medicine.js"></script>
</body>
</html>

