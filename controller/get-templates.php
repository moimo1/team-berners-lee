<?php
session_start();
include '../config/db_con.php';
header('Content-Type: application/json');

if (!isset($_SESSION['id']) || $_SESSION['role'] !== 'doctor') {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

$doctorID = $_SESSION['id'];
$clientID = $_GET['client_id'] ?? null;

if ($clientID) {
    $sql = "SELECT templateID, templateName, medicines FROM prescription_templates WHERE doctorID = ? AND clientID = ? ORDER BY templateName ASC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $doctorID, $clientID);
} else {
    // If no client selected, return empty or all? Requirement says patient specific.
    // Let's return empty to be safe and force selection.
    echo json_encode([]);
    exit();
}
$stmt->execute();
$result = $stmt->get_result();

$templates = [];
while ($row = $result->fetch_assoc()) {
    // Medicines are stored as JSON strings in DB, decode them for the frontend
    $row['medicines'] = json_decode($row['medicines'], true);
    $templates[] = $row;
}

echo json_encode($templates);

$stmt->close();
$conn->close();
?>
