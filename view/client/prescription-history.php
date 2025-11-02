<?php
    session_start();
    $role = $_SESSION['role'];
    include '../../includes/navbar.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prescription History</title>
    <link rel="stylesheet" href="../../assets/css/client/dashboard.css">
    <link rel="stylesheet" href="../../assets/css/client/prescription-history.css">
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
            <div class="page-title-bar">
                <h2 class="page-title">Prescription History</h2>
                <div class="title-actions">
                    <button class="btn" title="Filter">Filter</button>
                </div>
            </div>
            <div class="card">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Expiry Date</th>
                            <th>Doctor</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="prescription-history-tbody">
                        <!-- <tr>
                            <td>Sept 20, 2025</td>
                            <td>Oct 13, 2025</td>
                            <td>Dr. Jose Rizal</td>
                            <td>Completed</td>
                        </tr>
                        <tr>
                            <td>Sept 23, 2025</td>
                            <td>Oct 15, 2025</td>
                            <td>Dr. Jose Rizal</td>
                            <td>Pending</td>
                        </tr> -->
                    </tbody>
                </table>
                <!-- Prescription Details Modal -->
                <div id="details-modal" class="modal">
                    <div class="modal-content">
                        <span class="close-btn">&times;</span>
                        <h3>Prescription Details</h3>
                        <div id="details-body"></div>
                    </div>
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

    <script>
        const USER_ROLE = '<?php echo $role; ?>';
    </script>
    <script src="../../assets/js/get-prescription-history.js"></script>
</body>
</html>


