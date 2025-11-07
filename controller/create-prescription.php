<?php
session_start();
include '../config/db_con.php';
header('Content-Type: application/json');

$doctorID = $_SESSION['id'];
$name = $_POST['client-name'];
$expiry = $_POST['expiry-date'];
$_status = $_POST['status'];

// Get Client ID for provided name
$sql_find_client = "
    SELECT id WHERE CONCAT(firstName, ' ', lastName) = ? FROM client";

$stmt_find_client = $conn->prepare($sql_find_client);
$$stmt_find_client->bind_param("s", $name);
$$stmt_find_client->execute();
$clientID = $$stmt_find_client->get_result();

// Get new Prescription ID
$sql_new_prescID = "
    SELECT prescID FROM prescription WHERE prescID LIKE 'P%'
    ORDER BY prescID DESC LIMIT 1";

$result = $conn->query($sql);

if ($result && $row = $result->fetch_assoc()) {
    // Extract numeric part
    $last_id = $row[$id_column];
    $number = (int)substr($last_id, strlen($prefix));
} else {
    // If no existing IDs, start at 0
    $number = 0;
}

// --- Increment and format new ID ---
$next_number = $number + 1;
$prescID = $prefix . str_pad($next_number, $padding, "0", STR_PAD_LEFT);

$sql_new_prescription = "
    INSERT INTO prescriptions (prescID, doctorID, dateGiven, dateExpiry)
    VALUES (?, ?, ?, ?)
";

$stmt_new_prescription = $conn->prepare($sql_new_prescription);
$stmt_new_prescription->bind_param("ssss", $prescID, $doctorID, "0-0-0000", $expiry);
$stmt_new_prescription->execute();
?>