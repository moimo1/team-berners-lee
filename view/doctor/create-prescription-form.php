<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Create Prescription</title>
    <link rel="stylesheet" href="assets/css/create-prescription-form.css">
</head>
<body>
    <div class="modal-container">
        <div class="modal">
            <h2>Create Prescription</h2>

            <form id="create-prescription-form" method="POST" action="../../controller/create-prescription.php">
                <!-- Client Name -->
                <label for="client-name">Client Name</label>
                <input type="text" id="client-name" name="client-name" placeholder="Enter client name" readonly>
                <span class="info-icon">Not Editable</span>

                <!-- Medicine List -->
                <label for="medicine-list">Medicine List</label>
                <div class="medicine-container">
                    <input type="text" id="medicine-list" name="medicine" placeholder="Medicine name">
                    <button type="button" id="add-medicine-btn">+ Add medicine</button>
                </div>

                <!-- Expiry Date -->
                <label for="expiry-date">Expiry Date</label>
                <input type="date" id="expiry-date" name="expiry-date">

                <!-- Status -->
                <label for="status">Status</label>
                <select id="status" name="status">
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                </select>

                <!-- Buttons -->
                <div class="form-actions">
                    <button type="submit" class="save-btn">Save</button>
                    <button type="button" class="cancel-btn">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <script src="../../assets/js/add-prescription.js"></script>
</body>
</html>
