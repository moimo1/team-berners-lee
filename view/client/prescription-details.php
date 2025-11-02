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
    <title>My Prescription</title>
    <link rel="stylesheet" href="../../assets/css/client/dashboard.css">
    <link rel="stylesheet" href="../../assets/css/client/prescription-details.css">
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
                <h2 class="page-title">My Prescription</h2>
                <div class="title-actions">
                    <a class="btn outline" href="./prescription-history.php">History</a>
                </div>
            </div>
            <div class="card">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Medicine</th>
                            <th>Dosage</th>
                            <th>Frequency</th>
                            <th>Total Amount</th>
                            <th>Amount Left</th>
                            <th>Expiry Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Amoxicillin</td>
                            <td>500mg</td>
                            <td>2x/day</td>
                            <td>20 tablets</td>
                            <td>15 tablets</td>
                            <td>05/08/2025</td>
                        </tr>
                        <tr>
                            <td>Paracetamol</td>
                            <td>500mg</td>
                            <td>3x/day</td>
                            <td>10 tablets</td>
                            <td>0 tablets</td>
                            <td>05/10/2025</td>
                        </tr>
                    </tbody>
                </table>
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
</body>
</html>


