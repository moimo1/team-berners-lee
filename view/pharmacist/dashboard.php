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
                <tr>
                    <td colspan="5" style="text-align:center; color:gray;">
                        Loading prescriptions...
                    </td>
                </tr>
            </tbody>
        </table>
    </main>

    <?php include '../../includes/footer.php'; ?>

    <script>
        const role = "<?php echo $role; ?>";
    </script>
    <script src="../../assets/js/get-all-prescriptions.js"></script>
</body>
</html>
