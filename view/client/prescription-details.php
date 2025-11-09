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
    <link rel="stylesheet" href="../../assets/css/header.css">
    <link rel="stylesheet" href="../../assets/css/client/dashboard.css">
    <link rel="stylesheet" href="../../assets/css/client/prescription-details.css">
    </head>

<body class="has-sidebar">
    <?php include '../../includes/header.php'; ?>
    <main class="client-dashboard" id="clientDashboard">
        <?php 
        $currentPage = 'prescription-details';
        include '../../includes/sidebar.php'; 
        ?>

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
                            <th>Amount Left</th>
                            <th>Expiry Date</th>
                        </tr>
                    </thead>
                    <tbody id="prescription-details-tbody">
                        <tr>
                            <td colspan="5" style="text-align: center; padding: 24px; color: #64748b;">Loading prescription details...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </main>


    <?php include '../../includes/footer.php'; ?>

    <script src="../../assets/js/get-prescription.js"></script>
</body>
</html>


