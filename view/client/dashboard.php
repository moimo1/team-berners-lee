<?php
    session_start();
    $role = 'client';
    include '../../includes/navbar.php';
    
    // Fetch client name and medicine details from database
    $clientName = 'Client';
    $medicineDetails = [];
    if (isset($_SESSION['id'])) {
        include '../../config/db_con.php';
        $clientID = $_SESSION['id'];
        
        // Get client name
        $sql = "SELECT firstName, lastName FROM client WHERE clientID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $clientID);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            $clientName = trim($row['firstName'] . ' ' . $row['lastName']);
        }
        $stmt->close();
        
        // Get most recent prescription
        $sql = "SELECT * FROM prescription WHERE clientID = ? ORDER BY dateGiven DESC LIMIT 1";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $clientID);
        $stmt->execute();
        $result = $stmt->get_result();
        $prescription = $result->fetch_assoc();
        $stmt->close();
        
        // Get medicine details from the prescription
        if ($prescription) {
            $prescID = trim($prescription["prescID"]);
            $prescIDForDetails = 'PD' . substr($prescID, 1);
            
            $sql_prescDetails = "SELECT pd.*, m.genericName, m.brand, m.description as medDescription
                                FROM prescriptiondetails pd 
                                JOIN medicine m ON pd.medID = m.medID
                                WHERE pd.prescID = ?
                                LIMIT 5";
            $stmt_details = $conn->prepare($sql_prescDetails);
            $stmt_details->bind_param("s", $prescIDForDetails);
            $stmt_details->execute();
            $result_details = $stmt_details->get_result();
            
            while ($row = $result_details->fetch_assoc()) {
                $medicineDetails[] = $row;
            }
            $stmt_details->close();
        }
        
        $conn->close();
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Client Dashboard</title>

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
            <h2>Welcome, <?php echo htmlspecialchars($clientName); ?>!</h2>

            <div class="card info-card">
                <div class="info-content">
                    <?php if (!empty($medicineDetails)): ?>
                        <h3>Current Medications</h3>
                        <div class="medicine-list">
                            <?php foreach ($medicineDetails as $med): ?>
                                <div class="medicine-item">
                                    <div class="medicine-name">
                                        <?php echo htmlspecialchars($med['genericName'] ?? 'N/A'); ?>
                                        <?php if (!empty($med['brand'])): ?>
                                            <span class="medicine-brand">(<?php echo htmlspecialchars($med['brand']); ?>)</span>
                                        <?php endif; ?>
                                    </div>
                                    <div class="medicine-info">
                                        <?php if (!empty($med['dosage'])): ?>
                                            <div class="medicine-dosage"><?php echo htmlspecialchars($med['dosage']); ?></div>
                                        <?php endif; ?>
                                        <?php if (!empty($med['remainingAmount'])): ?>
                                            <div class="medicine-remaining">Remaining: <?php echo htmlspecialchars($med['remainingAmount']); ?></div>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php else: ?>
                        <p class="no-data">No current medications found.</p>
                    <?php endif; ?>
                    <a href="./prescription-details.php" class="view-prescriptions-btn">View Your Prescriptions</a>
                </div>
            </div>

            <div class="card recent-prescriptions-card">
                <h3>Recent Prescriptions</h3>
                <div id="recent-prescriptions-list" class="prescriptions-list">
                    <p class="loading">Loading prescriptions...</p>
                </div>
            </div>
        </section>
    </main>

    <script>
    (function(){
        // Load recent prescriptions using existing get-prescription-history endpoint
        var prescriptionsList = document.getElementById('recent-prescriptions-list');
        if (prescriptionsList) {
            fetch('../../controller/get-prescription-history.php', { credentials: 'same-origin' })
                .then(async res => {
                    if (res.status === 401) {
                        prescriptionsList.innerHTML = '<p class="error">Please log in to view prescriptions.</p>';
                        return null;
                    }
                    
                    var contentType = res.headers.get('content-type');
                    if (!contentType || !contentType.includes('application/json')) {
                        prescriptionsList.innerHTML = '<p class="error">Invalid response format.</p>';
                        return null;
                    }
                    
                    if (!res.ok) {
                        prescriptionsList.innerHTML = '<p class="no-data">No recent prescriptions found.</p>';
                        return null;
                    }
                    
                    try {
                        return await res.json();
                    } catch (e) {
                        prescriptionsList.innerHTML = '<p class="error">Error parsing response.</p>';
                        return null;
                    }
                })
                .then(data => {
                    if (data === null || data === undefined) return;
                    
                    // Check if response contains an error
                    if (data.error) {
                        prescriptionsList.innerHTML = '<p class="error">' + (data.message || data.error) + '</p>';
                        return;
                    }
                    
                    prescriptionsList.innerHTML = '';

                    // Handle both array and empty object responses
                    if (!Array.isArray(data)) {
                        if (data && typeof data === 'object' && Object.keys(data).length === 0) {
                            prescriptionsList.innerHTML = '<p class="no-data">No recent prescriptions found.</p>';
                        } else {
                            prescriptionsList.innerHTML = '<p class="no-data">No recent prescriptions found.</p>';
                        }
                        return;
                    }

                    if (data.length === 0) {
                        prescriptionsList.innerHTML = '<p class="no-data">No recent prescriptions found.</p>';
                        return;
                    }

                    // Limit to 5 most recent
                    var recent = data.slice(0, 5);
                    recent.forEach(prescription => {
                        var item = document.createElement('div');
                        item.className = 'prescription-item';
                        
                        // Handle date parsing more safely
                        var dateGiven = null;
                        var dateExpiry = null;
                        try {
                            if (prescription.dateGiven) {
                                dateGiven = new Date(prescription.dateGiven);
                                if (isNaN(dateGiven.getTime())) dateGiven = null;
                            }
                            if (prescription.dateExpiry) {
                                dateExpiry = new Date(prescription.dateExpiry);
                                if (isNaN(dateExpiry.getTime())) dateExpiry = null;
                            }
                        } catch (e) {
                            // Date parsing failed, leave as null
                        }
                        
                        var doctorName = (prescription.doctorFirstName || '') + ' ' + (prescription.doctorLastName || '');
                        doctorName = doctorName.trim();
                        
                        item.innerHTML = `
                            <div class="prescription-date">${dateGiven ? dateGiven.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</div>
                            <div class="prescription-info">
                                <div class="prescription-doctor">Dr. ${doctorName || 'Unknown'}</div>
                                <div class="prescription-expiry">Expires: ${dateExpiry ? dateExpiry.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</div>
                            </div>
                        `;
                        prescriptionsList.appendChild(item);
                    });
                })
                .catch(err => {
                    console.error('Error loading prescriptions:', err);
                    prescriptionsList.innerHTML = '<p class="error">Error loading prescriptions. Please try again later.</p>';
                });
        }
    })();
    </script>

    <?php include '../../includes/footer.php'; ?>

    <script src="../../assets/js/get-prescription.js"></script>
</body>

</html>
