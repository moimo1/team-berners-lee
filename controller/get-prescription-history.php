<?php
session_start();
include '../config/db_config.php';
header('Content-Type: application/json');

$clientID=$_SESSION['id'];

$sql = "SELECT doctor.firstName, doctor.lastName, prescription.dateGiven, prescription.dateExpiry FROM doctor JOIN prescription ON doctor.doctorID = prescription.doctorID WHERE prescription.clientID=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $clientID);
$stmt->execute();
$result = $stmt->get_result();

$data =[];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}
echo json_encode($data);
?>