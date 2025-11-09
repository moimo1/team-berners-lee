<?php
session_start();
include '../config/db_con.php';
header('Content-Type: application/json');

// Make sure the user is logged in and has a role
if (!isset($_SESSION['role']) || !isset($_SESSION['id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$role = $_SESSION['role'];
$userID = $_SESSION['id'];
$data = [];

if ($role === 'client') {
    // Use firstName and lastName to match JavaScript expectations
    $sql = "SELECT p.prescID, p.dateGiven, p.dateExpiry, d.firstName AS doctorFirstName, d.lastName AS doctorLastName
            FROM prescription p
            JOIN doctor d ON p.doctorID = d.doctorID
            WHERE p.clientID = ?
            ORDER BY p.dateGiven DESC";
} else if ($role === 'doctor') {
    // Return all prescription columns + related client info
    $sql = "SELECT DISTINCT p.*, c.clientID, c.firstName AS clientFirstName, c.lastName AS clientLastName
            FROM prescription p
            JOIN client c ON p.clientID = c.clientID
            WHERE p.doctorID = ?
            ORDER BY p.dateGiven DESC";
} else {
    echo json_encode([]); 
    exit;
}

$stmt = $conn->prepare($sql);
if ($stmt === false) {
    http_response_code(500);
    echo json_encode(["error" => "prepare_failed", "message" => $conn->error]);
    exit;
}

// Use "s" for string since clientID and doctorID are char(4)
$stmt->bind_param("s", $userID);
$ok = $stmt->execute();
if (!$ok) {
    http_response_code(500);
    echo json_encode(["error" => "execute_failed", "message" => $stmt->error]);
    exit;
}

$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>