<?php
session_start();
include '../config/db_con.php';
header('Content-Type: application/json');

$doctorID = $_SESSION['id'];
$name = $_POST['client-name'];
$date = $_POST['date-given'];
$expiry = $_POST['expiry-date'];
$status = $_POST['status'];

// Get Client ID for provided name
$sql_find_client = "SELECT clientID FROM client WHERE CONCAT(firstName,' ',lastName) = ?";

$stmt_find_client = $conn->prepare($sql_find_client);
$stmt_find_client->bind_param("s", $name);
$stmt_find_client->execute();
$clientIDResult = $stmt_find_client->get_result();

// Check if name matches any client
if ($clientIDRow = $clientIDResult->fetch_assoc()) {
    $clientID = $clientIDRow['clientID'];
} else {
    echo "No client with such name found.";
}

// Get new Prescription ID
$sql_new_prescID = "SELECT prescID FROM prescription WHERE prescID LIKE 'P%' ORDER BY prescID DESC LIMIT 1";
$result = $conn->query($sql_new_prescID);

if ($result && $row = $result->fetch_assoc()) {
    // Extract numeric part
    $last_id = $row["prescID"];
    $number = (int)substr($last_id, strlen("P"));
} else {
    // If no existing IDs, start at 0
    $number = 0;
}

// --- Increment and format new ID ---
$next_number = $number + 1;
$prescID = "P" . str_pad($next_number, 3, "0", STR_PAD_LEFT);

$sql_new_prescription = "INSERT INTO prescription (prescID, doctorID, clientID, dateGiven, dateExpiry) VALUES (?, ?, ?, ?, ?)";

$stmt_new_prescription = $conn->prepare($sql_new_prescription);
$stmt_new_prescription->bind_param("sssss", $prescID, $doctorID, $clientID, $date, $expiry);
$stmt_new_prescription->execute();
?>