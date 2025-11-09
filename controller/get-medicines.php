<?php
session_start();

include '../config/db_con.php';
header('Content-Type: application/json');

$sql = "SELECT * FROM medicine";
$result = $conn->query($sql);

if ($result) {
    $medicines = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($medicines);
} else {
    echo json_encode([]);
}

$conn->close();
?>