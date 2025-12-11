<?php
  session_start();
  $role = $_SESSION['role'];

  include '../../../config/db_con.php';

  $adminId = $_SESSION['id'] ?? null;
  $adminName = 'Pharmacist Manager';

  $adminLocation = '';

  if ($adminId) {
    $sql = "SELECT firstName, lastName, location FROM pharma_admin WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $adminId);
    $stmt->execute();
    $result = $stmt->get_result();
    $admin = $result->fetch_assoc();
    if ($admin) {
      $adminName = trim(($admin['firstName'] ?? '') . ' ' . ($admin['lastName'] ?? '')) ?: $adminName;
      $adminLocation = $admin['location'] ?? '';
    }
  }

  include '../../../includes/navbar.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="admin-location" content="<?php echo htmlspecialchars($adminLocation); ?>">
  <title>Prescriptions by Pharmacist</title>

  <!-- Styles -->
  <link rel="stylesheet" href="/assets/css/header.css">
  <link rel="stylesheet" href="/assets/css/client/dashboard.css">
  <link rel="stylesheet" href="/assets/css/pharmacist/admin.css">
  <link rel="stylesheet" href="/assets/css/pharmacist/dashboard.css">
  <link rel="stylesheet" href="/assets/css/navbar.css">
</head>
<body class="has-sidebar">
  <?php include '../../../includes/header.php'; ?>
  <main class="client-dashboard" id="clientDashboard">
    <?php
      $currentPage = 'pharma-admin-prescriptions';
      include '../../../includes/sidebar.php';
    ?>

    <section class="item main-content">
      <div class="page-title-bar">
        <div>
          <p class="eyebrow">Pharmacist Admin</p>
          <h2 class="page-title">Prescription Oversight</h2>
          <p class="muted">Search and filter prescriptions by pharmacist, inspect details, and review history.</p>
        </div>
        <div class="title-actions">
          <span class="pill">Signed in as <?php echo htmlspecialchars($adminName); ?></span>
          <button class="btn btn-primary" id="refresh-prescriptions" type="button">Refresh</button>
        </div>
      </div>

      <div class="card">
        <div class="section-heading">
          <div>
            <h3>Filters</h3>
            <p class="muted">Focus on a pharmacist or status, or refine by date and keyword.</p>
          </div>
          <div class="inline-actions">
            <button class="btn btn-secondary" id="clear-filters" type="button">Reset</button>
            <button class="btn btn-primary" id="apply-filters" type="button">Apply</button>
          </div>
        </div>
        <div class="filter-bar">
          <div class="field">
            <label for="pharmacist-filter">Pharmacist</label>
            <select id="pharmacist-filter" aria-label="Filter by pharmacist">
              <option value="">All pharmacists</option>
            </select>
          </div>
          <div class="field">
            <label for="status-filter">Status</label>
            <select id="status-filter" aria-label="Filter by status">
              <option value="">Any status</option>
              <option value="Pending">Pending</option>
              <option value="Ready for Pickup">Ready for Pickup</option>
              <option value="Fulfilled">Fulfilled</option>
              <option value="Collected">Collected</option>
              <option value="Requires Review">Requires Review</option>
            </select>
          </div>
          <div class="field">
            <label for="from-date">From</label>
            <input type="date" id="from-date" aria-label="Start date">
          </div>
          <div class="field">
            <label for="to-date">To</label>
            <input type="date" id="to-date" aria-label="End date">
          </div>
          <div class="field">
            <label for="search-query">Search</label>
            <input type="text" id="search-query" placeholder="Prescription ID, client, medicine" aria-label="Search prescriptions">
          </div>
        </div>
      </div>

      <div class="card">
        <div class="section-heading">
          <div>
            <h3>Prescriptions by pharmacist</h3>
            <p class="muted">Click a row to inspect details and history.</p>
          </div>
          <div class="inline-actions">
            <span class="badge" id="prescription-count">0 results</span>
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Pharmacist</th>
              <th>Client</th>
              <th>Medicine</th>
              <th>Status</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="prescription-table-body">
            <tr><td colspan="7" style="text-align:center; color:#64748b;">Loading prescriptions...</td></tr>
          </tbody>
        </table>
      </div>

      <div class="grid detail-grid">
        <div class="card">
          <div class="section-heading">
            <div>
              <h3>Prescription details</h3>
              <p class="muted">Medicines, amounts, client, and status.</p>
            </div>
          </div>
          <div id="prescription-detail-card" class="details-grid">
            <p class="help-text">Select a prescription to view details.</p>
          </div>
        </div>

        <div class="card">
          <div class="section-heading">
            <div>
              <h3>History by pharmacist</h3>
              <p class="muted">Recent actions and fulfillment trends.</p>
            </div>
            <div class="inline-actions">
              <span class="pill" id="history-pharmacist-label">No pharmacist selected</span>
            </div>
          </div>
          <ul class="timeline" id="pharmacist-history-list">
            <li><strong>Pick a pharmacist</strong><span class="muted">History will appear here once a pharmacist is selected.</span></li>
          </ul>
        </div>
      </div>
    </section>
  </main>

  <?php include '../../../includes/footer.php'; ?>

  <!-- Scripts -->
  <script src="/assets/js/pharmacist-admin-prescriptions.js"></script>
</body>
</html>

