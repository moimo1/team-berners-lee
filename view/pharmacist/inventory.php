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
    <title>Inventory - Pharmacist</title>

    <!-- Styles -->
    <link rel="stylesheet" href="../../assets/css/header.css">
    <link rel="stylesheet" href="../../assets/css/pharma/inventory.css">
    <link rel="stylesheet" href="../../assets/css/navbar.css">
</head>

<body class="has-sidebar">
    <?php include '../../includes/header.php'; ?>
    <main class="pharmacist-dashboard" id="pharmacistDashboard">
        <?php 
            $currentPage = 'inventory';
            include '../../includes/sidebar.php'; 
        ?>

        <section class="item main-content">
            <h2>Inventory</h2>

            <!-- Search Bar -->
            <div class="search-container">
                <input type="text" id="search-medicine" class="search-input" placeholder="Search Medicine">
                <button id="search-btn" class="search-btn" aria-label="Search">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                </button>
            </div>

            <!-- Inventory Table -->
            <div class="table-container">
                <table class="inventory-table">
                    <thead>
                        <tr>
                            <th>Medicine Name</th>
                            <th>Brand</th>
                            <th>Stock</th>
                            <th>Expiry Date</th>
                            <th>Supplier</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="inventory-table-body">
                        <tr>
                            <td colspan="6" class="loading">Loading inventory...</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Add Medicine Button -->
            <button id="add-medicine-btn" class="add-medicine-btn">Add Medicine</button>
        </section>
    </main>

    <!-- Add Medicine Modal -->
    <div id="addMedicineModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add Medicine</h2>
                <span class="close-modal" data-modal="addMedicineModal">&times;</span>
            </div>
            <form id="add-medicine-form" class="medicine-form">
                <div class="form-group">
                    <label for="add-medicine-name">Medicine Name:</label>
                    <input type="text" id="add-medicine-name" name="medicine_name" required>
                    <span class="field-note">Not Editable Icon Here</span>
                </div>
                <div class="form-group">
                    <label for="add-medicine-brand">Medicine Brand:</label>
                    <input type="text" id="add-medicine-brand" name="medicine_brand" required>
                </div>
                <div class="form-group">
                    <label for="add-stock">Stock:</label>
                    <input type="number" id="add-stock" name="stock" min="0" required>
                </div>
                <div class="form-group">
                    <label for="add-expiry-date">Expiry Date:</label>
                    <input type="date" id="add-expiry-date" name="expiry_date" required>
                </div>
                <div class="form-group">
                    <label for="add-supplier">Supplier:</label>
                    <input type="text" id="add-supplier" name="supplier" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Save</button>
                    <button type="button" class="btn btn-secondary close-modal" data-modal="addMedicineModal">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Update Inventory Modal -->
    <div id="updateInventoryModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Update Inventory</h2>
                <span class="close-modal" data-modal="updateInventoryModal">&times;</span>
            </div>
            <form id="update-inventory-form" class="medicine-form">
                <input type="hidden" id="update-medicine-id" name="medicine_id">
                <div class="form-group">
                    <label for="update-medicine-name">Medicine Name:</label>
                    <input type="text" id="update-medicine-name" name="medicine_name" readonly>
                    <span class="field-note">Not Editable Icon Here</span>
                </div>
                <div class="form-group">
                    <label for="update-medicine-brand">Medicine Brand:</label>
                    <input type="text" id="update-medicine-brand" name="medicine_brand" required>
                </div>
                <div class="form-group">
                    <label for="update-stock">Stock:</label>
                    <input type="number" id="update-stock" name="stock" min="0" required>
                </div>
                <div class="form-group">
                    <label for="update-expiry-date">Expiry Date:</label>
                    <input type="date" id="update-expiry-date" name="expiry_date" required>
                </div>
                <div class="form-group">
                    <label for="update-supplier">Supplier:</label>
                    <input type="text" id="update-supplier" name="supplier" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Save</button>
                    <button type="button" class="btn btn-secondary close-modal" data-modal="updateInventoryModal">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <?php include '../../includes/footer.php'; ?>

    <!-- Scripts -->
    <script src="../../assets/js/pharma/inventory.js"></script>
</body>
</html>

