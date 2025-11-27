<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pharmacist Admin | Prescription Details</title>
  <link rel="stylesheet" href="../../assets/css/pharmacist/admin.css">
</head>
<body>
  <header>
    <div class="brand">
      <strong>MediTrack Admin</strong>
      <span>Pharmacist oversight cockpit</span>
    </div>
    <nav class="nav-links">
      <a href="./dashboard.php">Dashboard</a>
      <a href="./prescription-search.php">Search</a>
      <a href="./prescription-details.php" class="active">Prescription View</a>
      <a href="./pharmacist-history.php">History</a>
    </nav>
  </header>

  <main>
    <section class="card">
      <h2>Prescription Overview</h2>
      <p class="help-text">All fulfillment checkpoints captured for audit and compliance.</p>
      <div class="filter-bar">
        <div>
          <label for="details-pharmacist-filter">Pharmacist</label>
          <select id="details-pharmacist-filter"></select>
        </div>
        <div>
          <label for="details-prescription-select">Prescription</label>
          <select id="details-prescription-select"></select>
        </div>
      </div>
      <div class="details-grid" id="details-grid">
        <div class="detail-card">
          <span>Medicine</span>
          <strong id="details-medicine">—</strong>
        </div>
        <div class="detail-card">
          <span>Quantity</span>
          <strong id="details-quantity">—</strong>
        </div>
        <div class="detail-card">
          <span>Client</span>
          <strong id="details-client">—</strong>
        </div>
        <div class="detail-card">
          <span>Pharmacist</span>
          <strong id="details-pharmacist">—</strong>
        </div>
        <div class="detail-card">
          <span>Status</span>
          <strong id="details-status">—</strong>
        </div>
        <div class="detail-card">
          <span>Pickup Window</span>
          <strong id="details-pickup-window">—</strong>
        </div>
      </div>
    </section>

    <section class="card">
      <h3>Verification Checklist</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Step</th>
            <th>Owner</th>
            <th>Timestamp</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody id="verification-table-body">
          <tr>
            <td colspan="4">Select a prescription to load checklist steps.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="card">
      <h3>Compliance Notes</h3>
      <textarea rows="4" id="compliance-notes" placeholder="Add manager remarks, counseling notes, or follow-up tasks."></textarea>
      <div class="help-text" id="notes-meta">Notes are immutable once the client collects the medication.</div>
    </section>
  </main>

  <script src="../../assets/js/pharmacist-admin-details.js"></script>
</body>
</html>

