<?php 
session_start();
include '../config/db_con.php';

header('Content-Type: application/json');

$query = "
    SELECT 
        p.prescID, 
        p.clientID,
        c.firstName AS clientFirstName, 
        c.lastName AS clientLastName, 
        p.dateGiven, 
        p.dateExpiry
    FROM prescription p
    JOIN client c ON p.clientID = c.clientID
    ORDER BY p.dateGiven DESC
";

$stmt = $conn->prepare($query);
$stmt->execute();
$result = $stmt->get_result();

$prescriptions = [];
while ($row = $result->fetch_assoc()) {
    $prescriptions[] = $row;
}

echo json_encode($prescriptions);
?>
