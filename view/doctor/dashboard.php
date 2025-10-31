<?php
  session_start();
  $role = $_SESSION['role'];
  include '../../includes/navbar.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Doctor's Dashboard</title>
  <link rel="stylesheet" href="../../assets/css/doctor/dashboard.css">
  <link rel="stylesheet" href="../../assets/css/navbar.css">
</head>
<body>

  <div class="doctor-dashboard">
    <div class="item">Header</div>
    <div class="item">Sidebar</div>
    <div class="item main-content">
      <table>
        <tbody id="prescription-history-tbody"></tbody>
      </table>
    </div>
    <div class="item">Footer</div>
  </div>

  <?php include '../../includes/footer.php'; ?>

  <script>
    const USER_ROLE = '<?php echo $role; ?>';
  </script>
  <script src="../../assets/js/get-prescription-history.js"></script>
</body>
</html>
