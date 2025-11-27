<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pharmacist Admin | Search Prescriptions</title>
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
      <a href="./prescription-search.php" class="active">Search</a>
      <a href="./prescription-details.php">Prescription View</a>
      <a href="./pharmacist-history.php">History</a>
    </nav>
  </header>

  <main>
    <section class="card">
      <h2>Search Prescriptions</h2>
      <p class="help-text">Filter by pharmacist, medicine, client, or fulfillment status to spotlight a specific workload.</p>
      <div class="filter-bar">
        <div>
          <label for="pharmacist">Pharmacist</label>
          <select id="pharmacist">
            <option value="">All pharmacists</option>
            <option>Amelia Cruz</option>
            <option>Daniel Li</option>
            <option>Marcus Lee</option>
            <option>Sophie Patel</option>
          </select>
        </div>
        <div>
          <label for="medicine">Medicine</label>
          <input id="medicine" type="text" placeholder="e.g., Metformin">
        </div>
        <div>
          <label for="client">Client Name</label>
          <input id="client" type="text" placeholder="Search client">
        </div>
        <div>
          <label for="status">Status</label>
          <select id="status">
            <option value="">Any status</option>
            <option>Fulfilled</option>
            <option>Ready for Pickup</option>
            <option>Insurance Hold</option>
            <option>Requires Review</option>
          </select>
        </div>
      </div>
      <p class="help-text">Live results refresh with every filter change.</p>
      <p class="help-text status-pending" id="search-last-updated"></p>
    </section>

    <section class="card">
      <h3>Filtered Results</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Rx #</th>
            <th>Pharmacist</th>
            <th>Medicine</th>
            <th>Client</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="search-results-body">
          <tr>
            <td colspan="5">Apply your first filter to see matches.</td>
          </tr>
        </tbody>
      </table>
      <div class="chips" id="search-meta-chips"></div>
    </section>
  </main>

  <script src="../../assets/js/pharmacist-admin-search.js"></script>
</body>
</html>

