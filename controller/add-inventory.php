<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['id']) || $_SESSION['role'] !== 'pharma') {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Unauthorized"]);
    exit;
}

include '../config/db_con.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid request data"]);
    exit;
}

$medicineName = $data['medicine_name'] ?? '';
$medicineBrand = $data['medicine_brand'] ?? '';
$stock = $data['stock'] ?? 0;
$expiryDate = $data['expiry_date'] ?? '';
$supplier = $data['supplier'] ?? '';

if (empty($medicineName) || empty($medicineBrand) || empty($expiryDate)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing required fields"]);
    exit;
}

// Generate medicine ID
$sql = "SELECT MAX(CAST(SUBSTRING(medID, 2) AS UNSIGNED)) as maxNum FROM medicine";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$nextNum = ($row['maxNum'] ?? 0) + 1;
$medID = 'M' . str_pad($nextNum, 3, '0', STR_PAD_LEFT);

// Insert new medicine
$sql = "INSERT INTO medicine (medID, genericName, brand, expiryDate, amount, description) 
        VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error: " . $conn->error]);
    exit;
}

$description = "Supplier: " . $supplier;
$stmt->bind_param("ssssis", $medID, $medicineName, $medicineBrand, $expiryDate, $stock, $description);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Medicine added successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Failed to add medicine: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>

