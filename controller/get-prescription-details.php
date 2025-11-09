<?php
session_start();
include '../config/db_con.php';
header('Content-Type: application/json');

// ✅ Ensure prescID is provided
if (!isset($_GET['prescID']) || empty($_GET['prescID'])) {
    echo json_encode(["error" => "Missing prescID"]);
    exit;
}

$prescID = $_GET['prescID'];

// ✅ Get prescription + client info
$sql_prescription = "
    SELECT p.prescID, c.firstName AS clientFirstName, c.lastName AS clientLastName
    FROM prescription p
    JOIN client c ON p.clientID = c.clientID
    WHERE p.prescID = ?
";

$stmt = $conn->prepare($sql_prescription);
$stmt->bind_param("s", $prescID);
$stmt->execute();
$prescriptionResult = $stmt->get_result();
$prescription = $prescriptionResult->fetch_assoc();

if (!$prescription) {
    echo json_encode(["error" => "Prescription not found"]);
    exit;
}

// ✅ Get medicine details for that prescription
$sql_details = "
    SELECT 
        pd.medID,
        pd.prescID,
        m.genericName AS medicineName,
        pd.dosage, 
        pd.remainingAmount AS amountRemaining
    FROM prescriptiondetails pd
    JOIN medicine m ON pd.medID = m.medID
    WHERE pd.prescID = ?
";

$stmt_details = $conn->prepare($sql_details);
$stmt_details->bind_param("s", $prescID);
$stmt_details->execute();
$result_details = $stmt_details->get_result();

$medicines = [];
while ($row = $result_details->fetch_assoc()) {
    $medicines[] = $row;
}

// ✅ Return structured JSON that matches JS expectations
echo json_encode([
    'clientFirstName' => $prescription['clientFirstName'],
    'clientLastName' => $prescription['clientLastName'],
    'medicines' => $medicines
]);
?>