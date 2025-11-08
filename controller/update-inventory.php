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

$medicineID = $data['medicine_id'] ?? '';
$medicineBrand = $data['medicine_brand'] ?? '';
$stock = $data['stock'] ?? 0;
$expiryDate = $data['expiry_date'] ?? '';
$supplier = $data['supplier'] ?? '';

if (empty($medicineID) || empty($medicineBrand) || empty($expiryDate)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing required fields"]);
    exit;
}

// Update medicine
$sql = "UPDATE medicine 
        SET brand = ?, expiryDate = ?, amount = ?, description = ? 
        WHERE medID = ?";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error: " . $conn->error]);
    exit;
}

$description = "Supplier: " . $supplier;
$stmt->bind_param("ssiss", $medicineBrand, $expiryDate, $stock, $description, $medicineID);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Inventory updated successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Failed to update inventory: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>

