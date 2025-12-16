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
  <title>Prescription History - Doctor</title>

  <!-- Styles -->
  <link rel="stylesheet" href="../../assets/css/header.css">
  <link rel="stylesheet" href="../../assets/css/client/dashboard.css">
  <link rel="stylesheet" href="../../assets/css/doctor/dashboard.css">
  <link rel="stylesheet" href="../../assets/css/client/prescription-history.css">
  <link rel="stylesheet" href="../../assets/css/navbar.css">
</head>
<body class="has-sidebar">
  <?php include '../../includes/header.php'; ?>
  <main class="client-dashboard" id="clientDashboard">
    <?php 
      $currentPage = 'prescriptions';
      include '../../includes/sidebar.php'; 
    ?>

    <section class="item main-content">
      <div class="page-title-bar">
        <h2 class="page-title">Prescription History</h2>
        <div class="title-actions">
          <a href="./dashboard.php" class="btn" title="Back to Dashboard">Back</a>
        </div>
      </div>
      
      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Date Given</th>
              <th>Date Expiry</th>
              <th>Patient Name</th>
            </tr>
          </thead>
          <tbody id="prescription-history-tbody">
            <tr>
              <td colspan="3" style="text-align: center; padding: 24px; color: #64748b;">Loading prescriptions...</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Prescription Details Modal -->
      <div id="prescription-details-modal" class="modal">
        <div class="modal-content">
          <span class="close-btn">&times;</span>
          <h3>Prescription Details</h3>
          <div id="prescription-details-body"></div>
        </div>
      </div>
    </section>
  </main>

  <?php include '../../includes/footer.php'; ?>

  <!-- Scripts -->
  <script>
    const USER_ROLE = '<?php echo $role; ?>';
  </script>
  <script src="../../assets/js/doctor-prescriptions.js"></script>
</body>
</html>

