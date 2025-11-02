<?php
session_start();
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized", "message" => "Please log in to search medicines."]);
    exit;
}

include '../config/db_con.php';

// Get search parameters
$query = isset($_GET['query']) ? trim($_GET['query']) : '';
$searchType = isset($_GET['type']) ? $_GET['type'] : 'genericName';

if (empty($query)) {
    http_response_code(400);
    echo json_encode(["error" => "Bad Request", "message" => "Search query is required."]);
    exit;
}

// Validate search type - prevent SQL injection
$validSearchTypes = ['genericName', 'brand'];
if (!in_array($searchType, $validSearchTypes)) {
    $searchType = 'genericName';
}

// Sanitize search type field name (whitelist approach)
$searchField = $searchType === 'brand' ? 'brand' : 'genericName';

// Prepare SQL query based on search type
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

