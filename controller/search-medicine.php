<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized", "message" => "Please log in to search medicines."]);
    exit;
}

include '../config/db_con.php';

$query = isset($_GET['query']) ? trim($_GET['query']) : '';
$searchType = isset($_GET['type']) ? $_GET['type'] : 'genericName';

if (empty($query)) {
    echo json_encode([]);
    exit;
}

$validSearchTypes = ['genericName', 'brand'];
if (!in_array($searchType, $validSearchTypes)) {
    $searchType = 'genericName';
}

$searchField = $searchType === 'brand' ? 'brand' : 'genericName';

$sql = "SELECT medID, genericName, brand, manufactureDate, expiryDate, description 
        FROM medicine 
        WHERE " . $searchField . " LIKE ? 
        ORDER BY genericName ASC";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Database Error", "message" => "Failed to prepare statement."]);
    exit;
}

$searchParam = '%' . $query . '%';
$stmt->bind_param("s", $searchParam);
$ok = $stmt->execute();

if (!$ok) {
    http_response_code(500);
    echo json_encode(["error" => "Database Error", "message" => $stmt->error]);
    exit;
}

$result = $stmt->get_result();
$medicines = [];

while ($row = $result->fetch_assoc()) {
    $medicines[] = $row;
}

echo json_encode($medicines);
$stmt->close();
$conn->close();
?>

