<?php
    session_start();
    $role = 'pharma';
    include '../../includes/navbar.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pharmacist Dashboard</title>

    <!-- Styles -->
    <link rel="stylesheet" href="../../assets/css/header.css">
    <link rel="stylesheet" href="../../assets/css/pharma/dashboard.css">
    <link rel="stylesheet" href="../../assets/css/navbar.css">
</head>

<body class="has-sidebar">
    <?php include '../../includes/header.php'; ?>
    <main class="pharmacist-dashboard" id="pharmacistDashboard">
        <?php 
            $currentPage = 'dashboard';
            include '../../includes/sidebar.php'; 
        ?>

        <section class="item main-content">
            <h2 id="pharmacist-name">Welcome!</h2>

            <!-- Welcome Card -->
            <div class="card welcome-card">
                <div class="welcome-content">
                    <h3 id="welcome-title">Welcome, Dr. Carlo Mendoza!</h3>
                    <p>Track medicine inventory and update client medication status.</p>
                    <a href="./prescription-details.php" class="go-to-prescriptions-btn">
                        Go to Prescriptions
                    </a>
                </div>
            </div>

            <!-- Recent Activities Card -->
            <div class="card recent-activities-card">
                <h3>Recent Activities</h3>
                <div id="recent-activities-list" class="activities-list">
                    <p class="loading">Loading activities...</p>
                </div>
            </div>
        </section>
    </main>

    <?php include '../../includes/footer.php'; ?>

    <!-- Scripts -->
    <script src="../../assets/js/pharma/dashboard.js"></script>
</body>
</html>
