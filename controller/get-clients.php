<?php
session_start();

include '../config/db_con.php';
header('Content-Type: application/json');

$sql = "SELECT clientID, firstName, lastName FROM client ORDER BY firstName, lastName";
$result = $conn->query($sql);

if ($result) {
    $clients = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($clients);
} else {
    echo json_encode([]);
}

$conn->close();
?>

