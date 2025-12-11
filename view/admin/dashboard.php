<?php
  session_start();
  if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    header("Location: /index.php");
    exit();
  }

  include '../../config/db_con.php';
  $adminId = $_SESSION['id'] ?? null;
  $adminName = 'Admin';

  if ($adminId) {
    $sql = "SELECT username FROM temp WHERE adminID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $adminId);
    $stmt->execute();
    $result = $stmt->get_result();
    $admin = $result->fetch_assoc();
    if ($admin && !empty($admin['username'])) {
      $adminName = $admin['username'];
    }
  }

  $role = $_SESSION['role'];
  include '../../includes/navbar.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard</title>

  <link rel="stylesheet" href="/assets/css/header.css">
  <link rel="stylesheet" href="/assets/css/client/dashboard.css">
  <link rel="stylesheet" href="/assets/css/admin/dashboard.css">
  <link rel="stylesheet" href="/assets/css/navbar.css">
</head>
<body class="has-sidebar">
  <?php include '../../includes/header.php'; ?>
  <main class="client-dashboard admin-dashboard" id="clientDashboard">
    <?php
      $currentPage = 'admin-dashboard';
      include '../../includes/sidebar.php';
    ?>

    <section class="item main-content">
      <div class="admin-shell">
        <div class="controls-row">
          <div class="filter-group">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="client">Client</button>
            <button class="filter-btn" data-filter="doctor">Doctor</button>
            <button class="filter-btn" data-filter="pharmacist">Pharmacist</button>
          </div>
          <div class="search-actions">
            <button class="btn-ghost" id="refresh-list" type="button">Refresh</button>
            <div class="search-box">
              <input type="text" id="search-input" placeholder="Search by name or email" aria-label="Search users">
              <svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.71.71l.27.28v.79l5 5L20.49 19l-5-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z" fill="currentColor"/>
              </svg>
            </div>
            <button class="btn-primary" id="search-button" type="button">Search</button>
          </div>
        </div>
      </div>

      <div class="admin-shell stacked">
        <div class="list-header">
          <h3>People</h3>
          <span class="badge"><span id="results-count">0</span> result(s)</span>
        </div>
        <div id="people-list" class="people-list">
          <div class="loading-state">Loading data...</div>
        </div>
      </div>

      <div class="admin-shell details-panel" id="detail-panel">
        <p class="admin-muted">Select a person to view details.</p>
        <button class="btn-ghost" id="edit-selected" type="button" style="margin-top:10px; display:none;">Edit details</button>
      </div>
    </section>
  </main>

  <?php include '../../includes/footer.php'; ?>

  <div class="modal" id="edit-modal" aria-hidden="true">
    <div class="modal-backdrop" data-close-modal></div>
    <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
      <div class="modal-header">
        <h3 id="edit-modal-title">Edit details</h3>
        <button class="modal-close" type="button" data-close-modal>&times;</button>
      </div>
      <form id="edit-form" class="modal-body">
        <input type="hidden" name="entityId" id="entity-id">
        <input type="hidden" name="entityType" id="entity-type">
        <div class="field">
          <label for="first-name">First name</label>
          <input type="text" id="first-name" name="firstName" required>
        </div>
        <div class="field">
          <label for="last-name">Last name</label>
          <input type="text" id="last-name" name="lastName" required>
        </div>
        <div class="field">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="field" id="specialization-field" style="display:none;">
          <label for="specialization">Specialization</label>
          <input type="text" id="specialization" name="specialization">
        </div>
        <div class="field" id="address-field" style="display:none;">
          <label for="address">Address</label>
          <input type="text" id="address" name="address">
        </div>
        <div class="field" id="location-field" style="display:none;">
          <label for="location">Location</label>
          <input type="text" id="location" name="location">
        </div>
        <div class="modal-actions">
          <button class="btn-ghost" type="button" data-close-modal>Cancel</button>
          <button class="btn-primary" type="submit">Save</button>
        </div>
        <p class="admin-muted" id="edit-status" style="margin-top:8px;"></p>
      </form>
    </div>
  </div>

  <script src="/assets/js/admin-dashboard.js"></script>
</body>
</html>

