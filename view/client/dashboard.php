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

    <!-- Styles -->
    <link rel="stylesheet" href="../../assets/css/header.css">
    <link rel="stylesheet" href="../../assets/css/client/dashboard.css">
    <link rel="stylesheet" href="../../assets/css/navbar.css">
</head>

<body class="has-sidebar">
    <?php include '../../includes/header.php'; ?>
    <main class="client-dashboard" id="clientDashboard">
        <?php 
            $currentPage = 'dashboard';
            include '../../includes/sidebar.php'; 
        ?>

        <section class="item main-content">
            <h2 id="client-name">Welcome!</h2>

            <!-- Current Medications -->
            <div class="card info-card">
                <div class="info-content">
                    <h3>Current Medications</h3>
                    <div id="medicine-list" class="medicine-list">
                        <p class="loading">Loading medications...</p>
                    </div>
                    <a href="./prescription-details.php" class="view-prescriptions-btn">
                        View Your Prescriptions
                    </a>
                </div>
            </div>

            <!-- Recent Prescriptions -->
            <div class="card recent-prescriptions-card">
                <h3>Recent Prescriptions</h3>
                <div id="recent-prescriptions-list" class="prescriptions-list">
                    <p class="loading">Loading prescriptions...</p>
                </div>
            </div>
        </section>
    </main>

    <?php include '../../includes/footer.php'; ?>

    <!-- Scripts -->
    <script src="../../assets/js/get-prescription.js"></script>
</body>
</html>
