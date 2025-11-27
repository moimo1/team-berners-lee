<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pharmacist Admin | History</title>
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
      <a href="./prescription-details.php">Prescription View</a>
      <a href="./pharmacist-history.php" class="active">History</a>
    </nav>
  </header>

  <main>
    <section class="card">
      <h2>Pharmacist History</h2>
      <p class="help-text">Trend view of each pharmacist’s throughput, average handling time, and issue rate.</p>
      <div class="history-filters">
        <div>
          <label for="history-pharmacist">Pharmacist</label>
          <select id="history-pharmacist"></select>
        </div>
        <div>
          <label for="history-range">Date Range</label>
          <select id="history-range"></select>
        </div>
        <div>
          <label for="history-metric">Metric</label>
          <select id="history-metric"></select>
        </div>
      </div>
    </section>

    <section class="card">
      <h3>Weekly Breakdown</h3>
      <table class="table history-table">
        <thead>
          <tr>
            <th>Week</th>
            <th>Prescriptions</th>
            <th>Avg. Time</th>
            <th>Errors</th>
            <th>Commentary</th>
          </tr>
        </thead>
        <tbody id="history-table-body">
          <tr>
            <td colspan="5">Select a pharmacist to load weekly metrics.</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="card">
      <h3>Recent Highlights</h3>
      <ul class="timeline" id="history-timeline">
        <li>
          <strong>Awaiting selection</strong>
          <span>Choose a pharmacist to surface highlights.</span>
        </li>
      </ul>
    </section>
  </main>

  <script src="../../assets/js/pharmacist-admin-history.js"></script>
</body>
</html>

