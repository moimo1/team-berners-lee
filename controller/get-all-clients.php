<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['id']) || $_SESSION['role'] !== 'pharma') {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

include '../config/db_con.php';

$sql = "SELECT clientID, firstName, lastName, email, contact as contacts 
        FROM client 
        ORDER BY lastName, firstName ASC";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Database error", "message" => $conn->error]);
    exit;
}

$stmt->execute();
$result = $stmt->get_result();

$clients = [];
while ($row = $result->fetch_assoc()) {
    $clients[] = $row;
}

echo json_encode($clients);
$stmt->close();
$conn->close();
?>

