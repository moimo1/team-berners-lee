<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Create Prescription</title>
    <link rel="stylesheet" href="../../assets/css/doctor/create-prescription-form.css">
</head>
<body>
    <div class="modal-container">
        <div class="modal">
            <h2>Create Prescription</h2>

            <form id="create-prescription-form" method="POST" action="../../controller/create-prescription.php">
                <!-- Client Name -->
                <div class="form-group">
                    <label for="client-name">Client Name</label>
                    <div class="client-search-container">
                        <input type="text" id="client-name" name="client-name" placeholder="Type to search client name..." autocomplete="off" list="" required>
                        <input type="hidden" id="client-id" name="client-id">
                        <div id="client-dropdown" class="client-dropdown"></div>
                    </div>
                </div>

                <!-- Medicine List -->
                <div class="form-group">
                    <label>Medicines</label>
                    <div class="medicine-search-container">
                        <input type="text" id="medicine-search" name="medicine-search" placeholder="Click the button to add medicine..." autocomplete="off" list="" readonly>
                        <button type="button" id="add-medicine-btn" class="add-medicine-btn-inside">+ Add Medicine</button>
                    </div>
                    <div id="selected-medicines-list" class="selected-medicines"></div>
                </div>

                <!-- Date Given -->
                <div class="form-group">
                    <label for="date-given">Date Given</label>
                    <input type="date" id="date-given" name="date-given" required>
                </div>

                <!-- Expiry Date -->
                <div class="form-group">
                    <label for="expiry-date">Expiry Date</label>
                    <input type="date" id="expiry-date" name="expiry-date" required>
                </div>

                <!-- Status -->
                <div class="form-group">
                    <label for="status">Status</label>
                    <select id="status" name="status" required>
                        <option value="Active">Active</option>
                        <option value="Expired">Expired</option>
                    </select>
                </div>

                <!-- Buttons -->
                <div class="form-actions">
                    <button type="submit" class="save-btn">💾 Save</button>
                    <button type="button" class="cancel-btn" onclick="window.history.back()">✖ Cancel</button>
                </div>
            </form>

        </div>
    </div>

    <!-- Medicine Details Modal -->
    <div id="medicine-details-modal" class="medicine-modal">
        <div class="medicine-modal-content">
            <span class="medicine-modal-close">&times;</span>
            <h3>Add Medicine</h3>
            <div id="medicine-modal-body">
                <div class="form-group">
                    <label for="modal-medicine-search">Medicine Name</label>
                    <div class="medicine-search-container-modal">
                        <input type="text" id="modal-medicine-search" name="modal-medicine-search" placeholder="Type to search medicines..." autocomplete="off" list="">
                        <div id="modal-medicine-dropdown" class="medicine-dropdown"></div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="medicine-dosage">Dosage</label>
                    <input type="text" id="medicine-dosage" name="medicine-dosage" placeholder="e.g., 500mg tablet every 6 hours" required>
                </div>
                <div class="form-group">
                    <label for="medicine-amount">Amount</label>
                    <input type="number" id="medicine-amount" name="medicine-amount" placeholder="e.g., 30" min="1" required>
                </div>
                <div class="form-group">
                    <label for="medicine-description">Description</label>
                    <textarea id="medicine-description" name="medicine-description" placeholder="e.g., Take after meals to relieve pain." rows="3" required></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" id="confirm-medicine-btn" class="save-btn">Confirm</button>
                    <button type="button" id="cancel-medicine-btn" class="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    </div>

    <script src="../../assets/js/add-prescription.js"></script>
</body>
</html>
