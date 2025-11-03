<?php 
session_start();

include '../config/db_con.php';
header('Content-Type: application/json');


$clientID = $_SESSION['id'];

$sql = "SELECT * FROM prescription WHERE clientID = ? ORDER BY dateGiven DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $clientID);
$ok = $stmt->execute();
if (!$ok) {
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

// Get details for the found prescription
$prescID = trim($prescription["prescID"]);
$prescIDForDetails = 'PD' . substr($prescID, 1);

$sql_prescDetails = "SELECT pd.*, m.* 
                    FROM prescriptiondetails pd 
                    JOIN medicine m ON pd.medID = m.medID
                    WHERE prescID = ?";
$stmt_details = $conn->prepare($sql_prescDetails);

$stmt_details->bind_param("s", $prescIDForDetails);
$ok2 = $stmt_details->execute();

$result_details = $stmt_details->get_result();

$data = [];
while ($row = $result_details->fetch_assoc()) {
    $row["dateExpiry"] = $prescription["dateExpiry"];
    $data[] = $row;
}

echo json_encode($data);
?>
