<?php
session_start();
include '../config/db_con.php';

// Make sure the user is logged in and has a role
if (!isset($_SESSION['role']) || !isset($_SESSION['id'])) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$role = $_SESSION['role'];
$userID = $_SESSION['id'];
$data = [];

if ($role === 'client') {
    // Return all prescription columns + related doctor info
    $sql = "SELECT p.*, d.doctorID, d.firstName AS doctorFirstName, d.lastName AS doctorLastName
            FROM prescription p
            JOIN doctor d ON p.doctorID = d.doctorID
            WHERE p.clientID = ?";
} else if ($role === 'doctor') {
    // Return all prescription columns + related client info
    $sql = "SELECT p.*, c.clientID, c.firstName AS clientFirstName, c.lastName AS clientLastName
            FROM prescription p
            JOIN client c ON p.clientID = c.clientID
            WHERE p.doctorID = ?";
} else {
    echo json_encode([]); 
    exit;
}

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userID);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>