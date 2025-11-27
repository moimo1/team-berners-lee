<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pharmacist Admin | Dashboard</title>
  <link rel="stylesheet" href="../../assets/css/pharmacist/admin.css">
</head>
<body>
  <header>
    <div class="brand">
      <strong>MediTrack Admin</strong>
      <span>Pharmacist oversight cockpit</span>
    </div>
    <nav class="nav-links">
      <a href="./dashboard.php" class="active">Dashboard</a>
      <a href="./prescription-search.php">Search</a>
      <a href="./prescription-details.php">Prescription View</a>
      <a href="./pharmacist-history.php">History</a>
    </nav>
  </header>

  <main>
    <section class="card">
      <h2>Team Pulse</h2>
      <p class="help-text">Snapshot of today’s fulfillment workload per pharmacist.</p>
      <div class="grid grid-3" id="team-pulse-cards" aria-live="polite">
        <p class="help-text">Loading metrics...</p>
      </div>
    </section>

    <section class="card">
      <h3>Pharmacists Overview</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Pharmacist</th>
            <th>Handled</th>
            <th>Pending</th>
            <th>Error Rate</th>
            <th>Shift</th>
          </tr>
        </thead>
        <tbody id="pharmacist-overview-body">
          <tr>
            <td colspan="5">Crunching roster metrics…</td>
          </tr>
        </tbody>
      </table>
      <div class="legend">
        <span class="on-track">On Track</span>
        <span class="delayed">Requires Intervention</span>
        <span class="attention">Critical</span>
      </div>
    </section>

    <section class="card">
      <h3>Recent Prescriptions</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Rx #</th>
            <th>Medicine</th>
            <th>Client</th>
            <th>Pharmacist</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="recent-prescriptions-body">
          <tr>
            <td colspan="5">Fetching recent prescriptions…</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>

  <script src="../../assets/js/pharmacist-admin-dashboard.js"></script>
</body>
</html>

