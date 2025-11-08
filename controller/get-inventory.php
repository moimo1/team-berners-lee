<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['id']) || $_SESSION['role'] !== 'pharma') {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

include '../config/db_con.php';

// Get all medicines from inventory
$sql = "SELECT medID as id, genericName as name, brand, amount as stock, expiryDate, 
        'N/A' as supplier
        FROM medicine 
        ORDER BY genericName ASC";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Database error", "message" => $conn->error]);
    exit;
}

$stmt->execute();
$result = $stmt->get_result();

$inventory = [];
while ($row = $result->fetch_assoc()) {
    $inventory[] = $row;
}

echo json_encode($inventory);
$stmt->close();
$conn->close();
?>

