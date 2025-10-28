<?php 
session_start();

include '../config/db_con.php';
header('Content-Type: application/json');

if (!isset($_SESSION['id']) || !isset($_SESSION['role']) || $_SESSION['role'] !== 'client') {
    http_response_code(401);
    echo json_encode([]);
    exit;
}

$clientID = $_SESSION['id'];

// Get the most recent prescription for this client
$sql = "SELECT * FROM prescription WHERE clientID = ? ORDER BY dateGiven DESC LIMIT 1";
$stmt = $conn->prepare($sql);
if ($stmt === false) {
    http_response_code(500);
    echo json_encode(["error" => "prepare_failed", "message" => $conn->error]);
    exit;
}
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
$sql_prescDetails = "SELECT * FROM prescriptiondetails WHERE prescID = ?";
$stmt_details = $conn->prepare($sql_prescDetails);
if ($stmt_details === false) {
    http_response_code(500);
    echo json_encode(["error" => "prepare_details_failed", "message" => $conn->error]);
    exit;
}
$stmt_details->bind_param("s", $prescription["prescID"]);
$ok2 = $stmt_details->execute();
if (!$ok2) {
    http_response_code(500);
    echo json_encode(["error" => "execute_details_failed", "message" => $stmt_details->error]);
    exit;
}
$result_details = $stmt_details->get_result();

$data = [];
while ($row = $result_details->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>
