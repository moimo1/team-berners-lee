<?php
  session_start();
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
  <title>Doctor's Dashboard</title>

  <!-- Styles -->
  <link rel="stylesheet" href="../../assets/css/header.css">
  <link rel="stylesheet" href="../../assets/css/client/dashboard.css">
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
      <h2 id="doctor-name">Welcome, Dr. <?php echo htmlspecialchars($doctorName); ?>!</h2>

      <!-- Recent Prescriptions -->
      <div class="card recent-prescriptions-card">
        <h3>Recent Prescriptions</h3>
        <div id="recent-prescriptions-list" class="prescriptions-list">
          <p class="loading">Loading prescriptions...</p>
        </div>
        <a href="./prescriptions.php" class="view-prescriptions-btn">
          View All Prescriptions
        </a>
      </div>

      <!-- Quick Actions -->
      <div class="card info-card">
        <div class="info-content">
          <h3>Quick Actions</h3>
          <div style="display: grid; gap: 12px; margin-top: 12px;">
            <a href="./create-prescription-form.php" class="view-prescriptions-btn" style="text-align: center;">
              Create New Prescription
            </a>
            <a href="./patients.php" class="view-prescriptions-btn" style="text-align: center;">
              View My Patients
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

  <!-- Styles for modal -->
  <link rel="stylesheet" href="../../assets/css/client/prescription-history.css">

  <!-- Scripts -->
  <script src="../../assets/js/doctor-dashboard.js"></script>
</body>
</html>
