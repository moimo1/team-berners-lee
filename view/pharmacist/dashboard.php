<?php
  require_once dirname(__DIR__, 2) . '/includes/session.php';
  requireRole('pharma');
  $role = $_SESSION['role'];
  
  // Get pharmacist's name from database
  include '../../config/db_con.php';
  $pharmacistID = $_SESSION['id'];
  $sql = "SELECT firstName, lastName FROM pharmacist WHERE pharmaID = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("s", $pharmacistID);
  $stmt->execute();
  $result = $stmt->get_result();
  $pharmacist = $result->fetch_assoc();
  $pharmacistName = ($pharmacist ? $pharmacist['firstName'] . ' ' . $pharmacist['lastName'] : 'Pharmacist');
  
  include '../../includes/navbar.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pharmacist Dashboard</title>

  <!-- Styles -->
  <link rel="stylesheet" href="../../assets/css/header.css">
  <link rel="stylesheet" href="../../assets/css/client/dashboard.css">
  <link rel="stylesheet" href="../../assets/css/pharmacist/dashboard.css">
  <link rel="stylesheet" href="../../assets/css/navbar.css">
</head>
<body class="has-sidebar">
  <?php include '../../includes/header.php'; ?>
  <main class="client-dashboard" id="clientDashboard">
    <?php 
      $currentPage = 'dashboard';
      include '../../includes/sidebar.php'; 
    ?>

    <section class="item main-content">
      <h2 id="pharmacist-name">Welcome, <?php echo htmlspecialchars($pharmacistName); ?>!</h2>

      <!-- Recent Prescriptions -->
      <div class="card recent-prescriptions-card">
        <h3>Recent Prescriptions</h3>
        <div id="recent-prescriptions-list" class="prescriptions-list">
          <p class="loading">Loading prescriptions...</p>
        </div>
        <a href="./client-list.php" class="view-prescriptions-btn">
          View All Prescriptions
        </a>
      </div>

      <!-- Quick Actions -->
      <div class="card info-card">
        <div class="info-content">
          <h3>Quick Actions</h3>
          <div style="display: grid; gap: 12px; margin-top: 12px;">
            <a href="./client-list.php" class="view-prescriptions-btn" style="text-align: center;">
              View All Prescriptions
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Prescription Details Modal -->
  <div id="prescription-details-modal" class="modal">
    <div class="modal-content">
      <span class="close-btn">&times;</span>
      <h3>Prescription Details</h3>
      <div id="prescription-details-body"></div>
    </div>
  </div>

  <?php include '../../includes/footer.php'; ?>

  <!-- Scripts -->
  <script src="../../assets/js/pharmacist-dashboard.js"></script>
</body>
</html>
