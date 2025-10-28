<?php 
session_start();

include '../config/db_con.php';
header('Content-Type: application/json');

$clientID = $_SESSION['id'];
$sql = "SELECT * FROM prescriptions WHERE clientID = ? ORDER BY dateGiven DESC LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $clientID);
$stmt->execute();
$result = $stmt->get_result();
$prescription = $result->fetch_assoc();

$sql_prescDetails = "SELECT * FROM prescriptiondetails WHERE prescID = ?";
$stmt_details = $conn->prepare($sql_prescDetails);
$stmt_details->bind_param("s", $prescription["prescID"]);
$stmt_details->execute();
$result_details = $stmt_details->get_result();

echo json_encode($data);
?>