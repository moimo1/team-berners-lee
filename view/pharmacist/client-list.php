<?php
  require_once dirname(__DIR__, 2) . '/includes/session.php';
  requireRole('pharma');
  $role = $_SESSION['role'];
  
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
  <title>Client Prescriptions - Pharmacist</title>

  <!-- Styles -->
  <link rel="stylesheet" href="../../assets/css/header.css">
  <link rel="stylesheet" href="../../assets/css/client/dashboard.css">
  <link rel="stylesheet" href="../../assets/css/pharmacist/dashboard.css">
  <link rel="stylesheet" href="../../assets/css/client/prescription-history.css">
  <link rel="stylesheet" href="../../assets/css/navbar.css">
</head>
<body class="has-sidebar">
  <?php include '../../includes/header.php'; ?>
  <main class="client-dashboard" id="clientDashboard">
    <?php 
      $currentPage = 'client-list';
      include '../../includes/sidebar.php'; 
    ?>

    <section class="item main-content">
      <div class="page-title-bar">
        <h2 class="page-title">Client Prescriptions</h2>
        <div class="title-actions">
          <a href="./dashboard.php" class="btn" title="Back to Dashboard">Back</a>
        </div>
      </div>

      <div class="card">
        <!-- Simple tab header to switch between Active and History views -->
        <div class="tab-header">
          <button id="tab-active-btn" class="btn btn-secondary tab-btn active" type="button">
            Active Prescriptions
          </button>
          <button id="tab-history-btn" class="btn btn-secondary tab-btn" type="button">
            History
          </button>
        </div>
      </div>

      <!-- Active prescriptions workspace -->
      <div id="tab-active" class="tab-panel">
        <div class="card">
          <?php include '../../includes/search-bar.php'; ?>
        </div>
        
        <div class="card">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client Name</th>
                <th>Date Given</th>
                <th>Date Expiry</th>
              </tr>
            </thead>
            <tbody id="prescription-active-tbody">
              <tr>
                <td colspan="4" style="text-align: center; padding: 24px; color: #64748b;">Loading prescriptions...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Read-only history tab -->
      <div id="tab-history" class="tab-panel" style="display:none;">
        <div class="card">
          <div class="history-filters" style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
            <strong>History Filter:</strong>
            <select id="history-view-filter" class="form-control" style="max-width:260px;">
              <option value="all">All (Expired &amp; Fully Dispensed)</option>
              <option value="expired">Expired Prescriptions</option>
              <option value="fully-dispensed">Fully Dispensed Prescriptions</option>
            </select>
            <span class="muted" style="font-size:0.85rem;">
              History is read-only and for audit/reference only.
            </span>
          </div>
        </div>

        <div class="card">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client Name</th>
                <th>Date Given</th>
                <th>Date Expiry</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="prescription-history-tbody">
              <tr>
                <td colspan="5" style="text-align: center; padding: 24px; color: #64748b;">Loading history...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Prescription Details Modal -->
      <div id="prescription-details-modal" class="modal">
        <div class="modal-content">
          <span class="close-btn">&times;</span>
          <h3>Prescription Details</h3>
          <div id="prescription-details-body"></div>
        </div>
      </div>

      <!-- Purchase Modal -->
      <div id="purchase-modal" class="modal">
        <div class="modal-content">
          <span class="close-btn purchase-close-btn">&times;</span>
          <h3>Purchase Medicine</h3>
          <div id="purchase-modal-body">
            <form id="purchase-form">
              <div class="form-group">
                <label for="medicine-name-display">Medicine:</label>
                <input type="text" id="medicine-name-display" readonly class="form-control">
              </div>
              <div class="form-group">
                <label for="remaining-amount-display">Amount Remaining:</label>
                <input type="text" id="remaining-amount-display" readonly class="form-control">
              </div>
              <div class="form-group">
                <label for="purchase-amount">Amount to Purchase:</label>
                <input type="number" id="purchase-amount" name="amount" min="1" required class="form-control">
                <small id="amount-error" class="error-message" style="display: none;"></small>
              </div>
              <input type="hidden" id="purchase-presc-id" name="prescID">
              <input type="hidden" id="purchase-med-id" name="medID">
              <div class="form-actions">
                <button type="button" id="cancel-purchase-btn" class="btn btn-secondary">Cancel</button>
                <button type="submit" id="confirm-purchase-btn" class="btn btn-primary">Confirm Purchase</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>

  <?php include '../../includes/footer.php'; ?>

  <!-- Scripts -->
  <script src="../../assets/js/pharmacist-client-list.js"></script>
</body>
</html>