<?php 
session_start();

include '../config/db_con.php';
header('Content-Type: application/json');


$clientID = $_SESSION['id'];

$sql = "SELECT * FROM prescription WHERE clientID = ? ORDER BY dateGiven DESC LIMIT 1";
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

// Get details for the found prescription
$sql_prescDetails = "SELECT * FROM prescriptiondetails WHERE prescID = ?";
$stmt_details = $conn->prepare($sql_prescDetails);

$stmt_details->bind_param("s", $prescription["prescID"]);
$ok2 = $stmt_details->execute();

$result_details = $stmt_details->get_result();

$data = [];
while ($row = $result_details->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>
