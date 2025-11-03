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
    <title>Pharmacist Dashboard</title>
    <link rel="stylesheet" href="../../assets/css/pharma/dashboard.css">
</head>
<body>

    <?php include '../../includes/search-bar.php'; ?>

    <main>
        <section class="recent-prescriptions">
            <h2>Most Recent Prescriptions</h2>

            <table>
                <thead>
                    <tr>
                        <th>Prescription ID</th>
                        <th>Client Name</th>
                        <th>Date Issued</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody id="prescription-table-body">
                    <!-- JS will inject prescription rows here -->
                </tbody>
            </table>
        </section>
    </main>

    <!-- PRESCRIPTION DETAILS MODAL -->
    <div id="prescriptionModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Prescription Details</h2>
                <span id="closeModal" class="close-btn">&times;</span>
            </div>

            <p><strong>Client Name:</strong> <span id="client-name">N/A</span></p>

            <table>
                <thead>
                    <tr>
                        <th>Medicine Name</th>
                        <th>Dosage</th>
                        <th>Amount Remaining</th>
                    </tr>
                </thead>
                <tbody id="details-body">
                    <!-- JS will inject medicine details here -->
                </tbody>
            </table>
        </div>
    </div>

    <?php include '../../includes/footer.php'; ?>

    <script>
        const role = "<?php echo $role; ?>";
    </script>
    <script src="../../assets/js/get-all-prescriptions.js"></script>
</body>
</html>
