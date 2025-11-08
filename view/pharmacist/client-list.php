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
    <title>Clients - Pharmacist</title>

    <!-- Styles -->
    <link rel="stylesheet" href="../../assets/css/header.css">
    <link rel="stylesheet" href="../../assets/css/pharma/client-list.css">
    <link rel="stylesheet" href="../../assets/css/navbar.css">
</head>

<body class="has-sidebar">
    <?php include '../../includes/header.php'; ?>
    <main class="pharmacist-dashboard" id="pharmacistDashboard">
        <?php 
            $currentPage = 'clients';
            include '../../includes/sidebar.php'; 
        ?>

        <section class="item main-content">
            <h2>Clients</h2>

            <!-- Search Bar -->
            <div class="search-container">
                <input type="text" id="search-client" class="search-input" placeholder="Search Client">
                <button id="search-btn" class="search-btn" aria-label="Search">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                </button>
            </div>

            <!-- Clients Table -->
            <div class="table-container">
                <table class="clients-table">
                    <thead>
                        <tr>
                            <th>Client Name</th>
                            <th>Email</th>
                            <th>Contact</th>
                            <th>Active Prescriptions</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="clients-table-body">
                        <tr>
                            <td colspan="5" class="loading">Loading clients...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </main>

    <?php include '../../includes/footer.php'; ?>

    <!-- Scripts -->
    <script src="../../assets/js/pharma/client-list.js"></script>
</body>
</html>

