<?php
  require_once dirname(__DIR__, 2) . '/includes/session.php';
  requireRole('doctor');
  $role = $_SESSION['role'];
  
  // Get doctor's name from database
  include '../../config/db_con.php';
  $doctorID = $_SESSION['id'];
  $sql = "SELECT firstName, lastName FROM doctor WHERE doctorID = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("s", $doctorID);
  $stmt->execute();
  $result = $stmt->get_result();
  $doctor = $result->fetch_assoc();
  $doctorName = ($doctor ? $doctor['firstName'] . ' ' . $doctor['lastName'] : 'Doctor');
  
  include '../../includes/navbar.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Create Prescription</title>

  <!-- Styles -->
  <link rel="stylesheet" href="../../assets/css/header.css">
  <link rel="stylesheet" href="../../assets/css/client/dashboard.css">
  <link rel="stylesheet" href="../../assets/css/doctor/dashboard.css">
  <link rel="stylesheet" href="../../assets/css/client/prescription-history.css">
  <link rel="stylesheet" href="../../assets/css/doctor/create-prescription-form.css">
  <link rel="stylesheet" href="../../assets/css/navbar.css">
</head>
<body class="has-sidebar">
  <?php include '../../includes/header.php'; ?>
  <main class="client-dashboard" id="clientDashboard">
    <?php 
      $currentPage = 'create-prescription';
      include '../../includes/sidebar.php'; 
    ?>

    <section class="item main-content">
      <div class="page-title-bar">
        <h2 class="page-title">Create Prescription</h2>
        <div class="title-actions">
          <a href="./dashboard.php" class="btn" title="Back to Dashboard">Back</a>
        </div>
      </div>

      <div class="card prescription-form-card">
        <form id="create-prescription-form" method="POST" action="../../controller/create-prescription.php">

          <!-- Load Template -->
          <div class="form-group" style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
            <label for="load-template" style="color: #0f172a; font-weight: 600;">📂 Load Saved Prescription</label>
            <select id="load-template" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #cbd5e1;">
              <option value="">-- Select a Template --</option>
            </select>
          </div>

          <!-- Client Name -->
          <div class="form-group">
            <label for="client-name">Client Name<span class="required">*</span></label>
            <div class="client-search-container">
              <input type="text" id="client-name" name="client-name" placeholder="Type to search client name..." autocomplete="off" list="" required>
              <input type="hidden" id="client-id" name="client-id">
              <div id="client-dropdown" class="client-dropdown"></div>
            </div>
          </div>

          <!-- Medicine List -->
          <div class="form-group">
            <label>Medicines<span class="required">*</span></label>
            <div class="medicine-search-container">
              <input type="text" id="medicine-search" name="medicine-search" placeholder="Click the button to add medicine..." autocomplete="off" list="" readonly>
              <button type="button" id="add-medicine-btn" class="add-medicine-btn-inside">+ Add Medicine</button>
            </div>
            <div id="selected-medicines-list" class="selected-medicines"></div>
          </div>

          <!-- Date Given -->
          <div class="form-group">
            <label for="date-given">Date Given<span class="required">*</span></label>
            <input type="date" id="date-given" name="date-given" required>
          </div>

          <!-- Expiry Date -->
          <div class="form-group">
            <label for="expiry-date">Expiry Date<span class="required">*</span></label>
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

          <!-- Save as Template -->
          <div class="form-group" style="margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" id="save-template" name="save-template" style="width: auto;">
              <span style="font-weight: 600; color: #00897b;">Save as Template for future use</span>
            </label>
            <div id="template-name-container" style="display: none; margin-top: 10px;">
              <label for="template-name">Template Name</label>
              <input type="text" id="template-name" name="template-name" placeholder="e.g., Flu Treatment Standard">
            </div>
          </div>

          <!-- Buttons -->
          <div class="form-actions">
            <button type="submit" class="save-btn">💾 Save</button>
            <button type="button" class="cancel-btn" onclick="window.history.back()">✖ Cancel</button>
          </div>
        </form>
      </div>
    </section>
  </main>

  <!-- Medicine Details Modal -->
  <div id="medicine-details-modal" class="medicine-modal">
    <div class="medicine-modal-content">
      <span class="medicine-modal-close">&times;</span>
      <h3>Add Medicine</h3>
      <div id="medicine-modal-body">
        <div class="form-group">
          <label for="modal-medicine-search">Medicine Name<span class="required">*</span></label>
          <div class="medicine-search-container-modal">
            <input type="text" id="modal-medicine-search" name="modal-medicine-search" placeholder="Type to search medicines..." autocomplete="off" list="">
            <div id="modal-medicine-dropdown" class="medicine-dropdown"></div>
          </div>
        </div>
        <div class="form-group">
          <label for="medicine-dosage">Dosage<span class="required">*</span></label>
          <input type="text" id="medicine-dosage" name="medicine-dosage" placeholder="e.g., 500mg tablet every 6 hours" required>
        </div>
        <div class="form-group">
          <label for="medicine-amount">Amount<span class="required">*</span></label>
          <input type="number" id="medicine-amount" name="medicine-amount" placeholder="e.g., 30" min="1" required>
        </div>
        <div class="form-group">
          <label for="medicine-description">Description<span class="required">*</span></label>
          <textarea id="medicine-description" name="medicine-description" placeholder="e.g., Take after meals to relieve pain." rows="3" required></textarea>
        </div>
        <div class="form-actions">
          <button type="button" id="confirm-medicine-btn" class="save-btn">Confirm</button>
          <button type="button" id="cancel-medicine-btn" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  </div>

  <?php include '../../includes/footer.php'; ?>

  <!-- Scripts -->
  <script src="../../assets/js/add-prescription.js"></script>
</body>
</html>
