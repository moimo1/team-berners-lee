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
  <title>Admin Profile</title>
  <link rel="stylesheet" href="/assets/css/header.css">
  <link rel="stylesheet" href="/assets/css/client/dashboard.css">
  <link rel="stylesheet" href="/assets/css/admin/dashboard.css">
  <link rel="stylesheet" href="/assets/css/navbar.css">
</head>
<body class="has-sidebar">
  <?php include '../../includes/header.php'; ?>
  <main class="client-dashboard admin-dashboard" id="clientDashboard">
    <?php
      $currentPage = 'admin-profile';
      include '../../includes/sidebar.php';
    ?>

    <section class="item main-content">
      <div class="admin-shell">
        <div class="admin-header-bar">
          <div>
            <p class="admin-eyebrow">Admin</p>
            <h2>Profile</h2>
            <p class="admin-muted">Signed in as <?php echo htmlspecialchars($adminName); ?>.</p>
          </div>
        </div>
        <div class="details-panel">
          <p class="admin-muted">Profile management can be extended here.</p>
        </div>
      </div>
    </section>
  </main>

  <?php include '../../includes/footer.php'; ?>
</body>
</html>


