<?php 
session_start();

include '../config/db_con.php';
header('Content-Type: application/json');

$clientID = $_SESSION['id'];
$sql = "SELECT * FROM prescriptions WHERE clientID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $clientID);
$stmt->execute();
$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>