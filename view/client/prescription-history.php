<?php
    require_once dirname(__DIR__, 2) . '/includes/session.php';
    requireRole('client');
    $role = $_SESSION['role'];
    include '../../includes/navbar.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prescription History</title>
    <link rel="stylesheet" href="../../assets/css/header.css">
    <link rel="stylesheet" href="../../assets/css/client/dashboard.css">
    <link rel="stylesheet" href="../../assets/css/client/prescription-history.css">
    <link rel="stylesheet" href="../../assets/css/navbar.css">
</head>

<body class="has-sidebar">
    <?php include '../../includes/header.php'; ?>
    <main class="client-dashboard" id="clientDashboard">
        <?php 
        $currentPage = 'prescription-history';
        include '../../includes/sidebar.php'; 
        ?>

        <section class="item main-content">
            <div class="page-title-bar">
                <h2 class="page-title">Prescription History</h2>
                <div class="title-actions">
                    <a class="btn outline" href="./prescription-details.php">My Prescription</a>
                </div>
            </div>
            <div class="card">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Expiry Date</th>
                            <th>Doctor</th>
                        </tr>
                    </thead>
                    <tbody id="prescription-history-tbody">
                        <tr>
                            <td colspan="3" style="text-align: center; padding: 24px; color: #64748b;">Loading prescription history...</td>
                        </tr>
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


    <?php include '../../includes/footer.php'; ?>

    <script>
        const USER_ROLE = '<?php echo $role; ?>';
    </script>
    <script src="../../assets/js/get-prescription-history.js"></script>
</body>
</html>


