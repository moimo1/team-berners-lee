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
      <a href="./dashboard.html">Dashboard</a>
      <a href="./prescription-search.html">Search</a>
      <a href="./prescription-details.html" class="active">Prescription View</a>
      <a href="./pharmacist-history.html">History</a>
    </nav>
  </header>

  <main>
    <section class="card">
      <h2>Prescription RX-48213</h2>
      <p class="help-text">All fulfillment checkpoints captured for audit and compliance.</p>
      <div class="details-grid">
        <div class="detail-card">
          <span>Medicine</span>
          <strong>Metformin 500 mg</strong>
        </div>
        <div class="detail-card">
          <span>Quantity</span>
          <strong>60 tablets</strong>
        </div>
        <div class="detail-card">
          <span>Client</span>
          <strong>Julia Howard</strong>
        </div>
        <div class="detail-card">
          <span>Pharmacist</span>
          <strong>Amelia Cruz</strong>
        </div>
        <div class="detail-card">
          <span>Status</span>
          <strong class="status-success">Fulfilled</strong>
        </div>
        <div class="detail-card">
          <span>Pickup Window</span>
          <strong>Nov 25 · 4‑6 PM</strong>
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
        <tbody>
          <tr>
            <td>Prescription Intake</td>
            <td>Daniel Li</td>
            <td>09:12 AM</td>
            <td>Insurance validated</td>
          </tr>
          <tr>
            <td>Dispensing</td>
            <td>Amelia Cruz</td>
            <td>10:03 AM</td>
            <td>Lot #MC-23304</td>
          </tr>
          <tr>
            <td>Quality Check</td>
            <td>Marcus Lee</td>
            <td>10:21 AM</td>
            <td>Dual verification complete</td>
          </tr>
          <tr>
            <td>Pickup Confirmation</td>
            <td>Front Desk</td>
            <td>Awaiting client</td>
            <td class="status-pending">Reminder sent</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="card">
      <h3>Compliance Notes</h3>
      <textarea rows="4" placeholder="Add manager remarks, counseling notes, or follow-up tasks."></textarea>
      <div class="help-text">Notes are immutable once the client collects the medication.</div>
    </section>
  </main>
</body>
</html>

