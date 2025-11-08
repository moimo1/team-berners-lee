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

$prescriptionID = $data['prescription_id'] ?? '';
$prescriptionDetailID = $data['prescription_detail_id'] ?? '';
$amount = $data['amount'] ?? 0;
$status = $data['status'] ?? 'Active';

if (empty($prescriptionID) || empty($prescriptionDetailID)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing required fields"]);
    exit;
}

// Update prescription details (remaining amount)
$sql = "UPDATE prescriptiondetails 
        SET remainingAmount = ? 
        WHERE prescID = ?";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database error: " . $conn->error]);
    exit;
}

$stmt->bind_param("is", $amount, $prescriptionID);

if ($stmt->execute()) {
    // Note: Status handling would require additional table structure
    // For now, we just update the amount
    echo json_encode(["success" => true, "message" => "Prescription updated successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Failed to update prescription: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>

