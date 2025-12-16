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

$sql = "SELECT * FROM prescription WHERE clientID = ? ORDER BY dateGiven DESC LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $clientID);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "execute_failed", "message" => $stmt->error]);
    exit;
}

$result = $stmt->get_result();
$prescription = $result->fetch_assoc();

if (!$prescription) {
    echo json_encode([]); 
    exit;
}

$prescID = trim($prescription["prescID"]);

$sql_prescDetails = "
    SELECT 
        pd.prescID,
        pd.dosage,
        pd.remainingAmount,
        m.medID,
        m.genericName,
        m.brand,
        m.description,
        ? AS dateExpiry
    FROM prescriptiondetails pd
    JOIN medicine m ON pd.medID = m.medID
    WHERE pd.prescID = ?
";
$stmt_details = $conn->prepare($sql_prescDetails);
$stmt_details->bind_param("ss", $prescription["dateExpiry"], $prescID);

if (!$stmt_details->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "execute_failed_details", "message" => $stmt_details->error]);
    exit;
}

$result_details = $stmt_details->get_result();

$data = [];
while ($row = $result_details->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>
