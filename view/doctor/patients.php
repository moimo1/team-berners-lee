<?php
  session_start();
  $role = $_SESSION['role'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prescription History</title>
  <link rel="stylesheet" href="../../assets/css/prescription-history.css">
</head>
<body class="client-dashboard">

  <!-- Page Title Bar -->
  <div class="page-title-bar">
    <h1 class="page-title">Prescription History</h1>
    <div class="title-actions">
      <button class="btn" onclick="window.history.back()">Back</button>
    </div>
  </div>

  <!-- Prescription History Table -->
  <table class="table">
    <thead>
      <tr>
        <th>Date Given</th>
        <th>Date Expiry</th>
        <th>Associated Person</th>
      </tr>
    </thead>
    <tbody id="prescription-history-tbody"></tbody>
  </table>

  <!-- Modal for Prescription Details -->
  <div id="details-modal" class="modal">
    <div class="modal-content">
      <span class="close-btn">&times;</span>
      <h2>Prescription Details</h2>
      <div id="details-body"></div>
    </div>
  </div>

<div id="add-medicine-modal" class="modal">
  <div class="modal-content" id="add-medicine-content">
<!-- form will be generated here -->
</div>
</div>

  <button id="create-prescription-btn" class="floating-btn">+</button>

  <!-- Scripts -->
  <script>
    const USER_ROLE = '<?php echo $role; ?>';
  </script>
  <script src ="../../assets/js/get-prescription-history.js"></script>
</body>
</html>
