<?php 
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['id'])) {
    http_response_code(401);
    echo json_encode(["error" => "unauthorized", "message" => "User not logged in."]);
    exit;
}

include '../config/db_con.php';
$clientID = $_SESSION['id'];

// Check if prescID is provided as parameter (for prescription history modal)
$prescID = isset($_GET['prescID']) ? trim($_GET['prescID']) : null;

if ($prescID) {
    // Fetch specific prescription by prescID
    // For clients, ensure they can only view their own prescriptions
    if (isset($_SESSION['role']) && $_SESSION['role'] === 'client') {
        $sql = "SELECT * FROM prescription WHERE prescID = ? AND clientID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $prescID, $clientID);
    } else {
        // For doctors/pharmacists, they can view any prescription
        $sql = "SELECT * FROM prescription WHERE prescID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $prescID);
    }
} else {
    // Fetch the most recent prescription for this client (for dashboard/prescription details page)
    $sql = "SELECT * FROM prescription WHERE clientID = ? ORDER BY dateGiven DESC LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $clientID);
}

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "execute_failed", "message" => $stmt->error]);
    exit;
}

$result = $stmt->get_result();
$prescription = $result->fetch_assoc();

if (!$prescription) {
    echo json_encode([]); // No prescriptions found
    exit;
}

$prescID = trim($prescription["prescID"]);

// Convert Pxxx to PDxxx for prescriptiondetails table lookup
// The prescriptiondetails table uses PDxxx format while prescription uses Pxxx
$prescDetailsID = $prescID;
if (preg_match('/^P(\d+)$/', $prescID, $matches)) {
    $prescDetailsID = 'PD' . $matches[1];
}

// Get client information for dashboard
$clientFirstName = '';
$clientLastName = '';
if (isset($_SESSION['role']) && $_SESSION['role'] === 'client') {
    $sql_client = "SELECT firstName, lastName FROM client WHERE clientID = ?";
    $stmt_client = $conn->prepare($sql_client);
    $stmt_client->bind_param("s", $clientID);
    if ($stmt_client->execute()) {
        $result_client = $stmt_client->get_result();
        $client = $result_client->fetch_assoc();
        if ($client) {
            $clientFirstName = $client['firstName'];
            $clientLastName = $client['lastName'];
        }
    }
    $stmt_client->close();
}

// Get the medicine details linked to this prescription
$sql_prescDetails = "
    SELECT 
        pd.prescID,
        pd.dosage,
        pd.remainingAmount,
        m.medID,
        m.genericName,
        m.brand,
        m.description,
        ? AS dateGiven,
        ? AS dateExpiry,
        ? AS prescID_original,
        ? AS clientFirstName,
        ? AS clientLastName
    FROM prescriptiondetails pd
    JOIN medicine m ON pd.medID = m.medID
    WHERE pd.prescID = ?
";
$stmt_details = $conn->prepare($sql_prescDetails);
$stmt_details->bind_param("ssssss", $prescription["dateGiven"], $prescription["dateExpiry"], $prescID, $clientFirstName, $clientLastName, $prescDetailsID);

if (!$stmt_details->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "execute_failed_details", "message" => $stmt_details->error]);
    exit;
}

$result_details = $stmt_details->get_result();

$data = [];
while ($row = $result_details->fetch_assoc()) {
    // Use the original prescID for consistency
    $row['prescID'] = $prescID;
    $data[] = $row;
}

echo json_encode($data);
?>
