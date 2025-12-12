<?php
  session_start();
  if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    header("Location: /index.php");
    exit();
  }

  $role = $_SESSION['role'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin | Details</title>
  <link rel="stylesheet" href="/assets/css/header.css">
  <link rel="stylesheet" href="/assets/css/admin/detail.css">
</head>
<body>
  <?php include '../../includes/header.php'; ?>

  <main class="detail-page">
    <div class="detail-header">
      <a href="/view/admin/dashboard.php" class="back-button" aria-label="Back to dashboard">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Dashboard
      </a>
    </div>

    <div class="detail-container">
      <div class="detail-card">
        <h2>Personal Information</h2>
        
        <div class="form-fields">
          <div class="form-group">
            <label for="first-name">First Name</label>
            <input class="form-input" type="text" id="first-name" name="firstName" readonly>
          </div>

          <div class="form-group">
            <label for="last-name">Last Name</label>
            <input class="form-input" type="text" id="last-name" name="lastName" readonly>
          </div>

          <div class="form-group" id="row-specialization">
            <label for="specialization">Specialization</label>
            <input class="form-input" type="text" id="specialization" name="specialization" readonly>
          </div>

          <div class="form-group" id="row-address">
            <label for="address">Address</label>
            <input class="form-input" type="text" id="address" name="address" readonly>
          </div>

          <div class="form-group" id="row-location">
            <label for="location">Location</label>
            <input class="form-input" type="text" id="location" name="location" readonly>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input class="form-input" type="email" id="email" name="email" readonly>
          </div>
        </div>

        <div class="actions">
          <button class="btn btn-primary" id="edit-btn" type="button">Edit Details</button>
          <button class="btn btn-ghost" id="cancel-btn" type="button" disabled>Cancel</button>
          <button class="btn btn-primary" id="save-btn" type="button" disabled>Save</button>
          <button class="btn btn-danger" id="delete-btn" type="button" style="margin-left: auto; background-color: #dc3545; color: white;">Delete User</button>
        </div>
        <p class="status" id="status"></p>
      </div>
    </div>
  </main>

  <input type="hidden" id="entity-type">
  <input type="hidden" id="entity-id">

  <script src="/assets/js/admin-detail.js"></script>
</body>
</html>


