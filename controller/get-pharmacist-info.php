<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['id']) || $_SESSION['role'] !== 'pharma') {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

include '../config/db_con.php';

$pharmacistID = $_SESSION['id'];

$sql = "SELECT pharmacistID, firstName, lastName, location, email 
        FROM pharmacist 
        WHERE pharmacistID = ?";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Database error", "message" => $conn->error]);
    exit;
}

$stmt->bind_param("s", $pharmacistID);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["error" => "Pharmacist not found"]);
    exit;
}

$pharmacist = $result->fetch_assoc();
$pharmacist['name'] = trim($pharmacist['firstName'] . ' ' . $pharmacist['lastName']);

echo json_encode($pharmacist);
$stmt->close();
$conn->close();
?>

