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
    <title>Prescription History</title>
    <link rel="stylesheet" href="../../assets/css/client/dashboard.css">
    <link rel="stylesheet" href="../../assets/css/client/prescription-history.css">
</head>

<body>
    <main class="client-dashboard">
        

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
            </div>
        </section>
    </main>

    <?php include '../../includes/footer.php'; ?>

    <script src="../../assets/js/get-prescription-history.js"></script>
</body>
</html>


