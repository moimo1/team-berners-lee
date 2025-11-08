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
    <title>Active Prescriptions - Pharmacist</title>

    <!-- Styles -->
    <link rel="stylesheet" href="../../assets/css/header.css">
    <link rel="stylesheet" href="../../assets/css/pharma/prescription-details.css">
    <link rel="stylesheet" href="../../assets/css/navbar.css">
</head>

<body class="has-sidebar">
    <?php include '../../includes/header.php'; ?>
    <main class="pharmacist-dashboard" id="pharmacistDashboard">
        <?php 
            $currentPage = 'prescriptions';
            include '../../includes/sidebar.php'; 
        ?>

        <section class="item main-content">
            <h2>Active Prescriptions</h2>

            <!-- Prescriptions Table -->
            <div class="table-container">
                <table class="prescriptions-table">
                    <thead>
                        <tr>
                            <th>Client Name</th>
                            <th>Prescribed Medicines</th>
                            <th>Expiry Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="prescriptions-table-body">
                        <tr>
                            <td colspan="5" class="loading">Loading prescriptions...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </main>

    <!-- Prescription Details Modal -->
    <div id="prescriptionDetailsModal" class="modal">
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h2>Prescription Details</h2>
                <span class="close-modal" data-modal="prescriptionDetailsModal">&times;</span>
            </div>
            <div id="prescription-details-content">
                <p class="loading">Loading prescription details...</p>
            </div>
        </div>
    </div>

    <!-- Update Prescription Modal -->
    <div id="updatePrescriptionModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Update Prescription</h2>
                <span class="close-modal" data-modal="updatePrescriptionModal">&times;</span>
            </div>
            <form id="update-prescription-form" class="medicine-form">
                <input type="hidden" id="update-prescription-id" name="prescription_id">
                <input type="hidden" id="update-prescription-detail-id" name="prescription_detail_id">
                <div class="form-group">
                    <label for="update-medicine-name-presc">Medicine Name:</label>
                    <input type="text" id="update-medicine-name-presc" name="medicine_name" readonly>
                    <span class="field-note">Not Editable Icon Here</span>
                </div>
                <div class="form-group">
                    <label for="update-amount">Amount:</label>
                    <input type="number" id="update-amount" name="amount" min="0" required>
                </div>
                <div class="form-group">
                    <label for="update-status">Status:</label>
                    <select id="update-status" name="status" required>
                        <option value="Active">Active</option>
                        <option value="Expired">Expired</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Confirm</button>
                    <button type="button" class="btn btn-secondary close-modal" data-modal="updatePrescriptionModal">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <?php include '../../includes/footer.php'; ?>

    <!-- Scripts -->
    <script src="../../assets/js/pharma/prescription-details.js"></script>
</body>
</html>

