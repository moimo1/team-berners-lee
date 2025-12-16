<?php
  require_once dirname(__DIR__, 3) . '/includes/session.php';
  requireRole('pharma_admin');
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
  <title>Pharmacist Admin Dashboard</title>

  <!-- Styles -->
  <link rel="stylesheet" href="/assets/css/header.css">
  <link rel="stylesheet" href="/assets/css/client/dashboard.css">
  <link rel="stylesheet" href="/assets/css/pharmacist/admin.css">
  <link rel="stylesheet" href="/assets/css/navbar.css">
</head>
<body class="has-sidebar">
  <?php include '../../../includes/header.php'; ?>
  <main class="client-dashboard" id="clientDashboard">
    <?php
      $currentPage = 'pharma-admin-dashboard';
      include '../../../includes/sidebar.php';
    ?>

    <section class="item main-content">
      <div class="page-title-bar">
        <div>
          <p class="eyebrow">Pharmacist Admin • <?php echo htmlspecialchars($adminLocation); ?></p>
          <h2 class="page-title">Team Oversight</h2>
          <p class="muted">Monitor fulfillment, pending work, and escalations for the pharmacy team.</p>
        </div>
        <div class="title-actions">
          <span class="pill">Signed in as <?php echo htmlspecialchars($adminName); ?></span>
          <button class="btn btn-primary" id="refresh-dashboard" type="button">Refresh</button>
        </div>
      </div>

      <div class="card">
        <div class="section-heading">
          <div>
            <h3>Team pulse</h3>
            <p class="muted">Live counts of completions, pending approvals, and items needing attention.</p>
          </div>
        </div>
        <div class="grid grid-3" id="team-pulse-cards">
          <p class="help-text">Loading metrics...</p>
        </div>
      </div>

      <div class="card">
        <div class="section-heading">
          <div>
            <h3>Pharmacist overview</h3>
            <p class="muted">Handled prescriptions for the team.</p>
          </div>
          <div class="legend">
            <span class="on-track">On track</span>
            <span class="delayed">Delayed</span>
            <span class="attention">Needs attention</span>
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Pharmacist</th>
              <th>Prescriptions handled</th>
            </tr>
          </thead>
          <tbody id="pharmacist-overview-body">
            <tr><td colspan="2">Loading pharmacists...</td></tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="section-heading">
          <div>
            <h3>Recent prescriptions</h3>
            <p class="muted">Newest orders flowing through the pharmacy.</p>
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Medicine</th>
              <th>Client</th>
              <th>Pharmacist</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="recent-prescriptions-body">
            <tr><td colspan="5">Loading prescriptions...</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>

  <?php include '../../../includes/footer.php'; ?>

  <script src="/assets/js/pharmacist-admin-dashboard.js"></script>
  <script>
    const refreshButton = document.getElementById('refresh-dashboard');
    if (refreshButton) {
      refreshButton.addEventListener('click', () => hydrateDashboard && hydrateDashboard());
    }
  </script>
</body>
</html>

