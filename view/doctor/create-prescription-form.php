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
                    <input type="text" id="client-name" name="client-name" placeholder="Enter client name">
                </div>

                <!-- Medicine List -->
                <div class="form-group">
                    <label for="medicine">Select Medicine</label>
                    <select id="medicine" name="medicine" required>
                        <option value="">-- Select Medicine --</option>
                        <option value="Paracetamol">Paracetamol</option>
                        <option value="Ibuprofen">Ibuprofen</option>
                        <option value="Amoxicillin">Amoxicillin</option>
                        <option value="Cough Syrup">Cough Syrup</option>
                    </select>
                    <button type="button" id="add-medicine-btn">+ Add Another</button>
                    <div id="additional-medicines"></div>
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

    <script src="../../assets/js/add-prescription.js"></script>
</body>
</html>
