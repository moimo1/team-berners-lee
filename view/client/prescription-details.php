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


    <?php include '../../includes/footer.php'; ?>
</body>
</html>


