<?php
session_start();
include '../config/db_con.php';
header('Content-Type: application/json');

$doctorID = $_SESSION['id'];
$clientID = $_POST['client-id'] ?? null;
$date = $_POST['date-given'];
$expiry = $_POST['expiry-date'];
$status = $_POST['status'];

// Validate client ID
if (!$clientID) {
    echo json_encode(['error' => 'Client ID is required']);
    exit();
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

if ($stmt_new_prescription->execute()) {
    // Get all medicine data from POST
    $medicineIndex = 0;
    $medicinesAdded = 0;
    
    while (isset($_POST["medicine-{$medicineIndex}-id"])) {
        $medID = $_POST["medicine-{$medicineIndex}-id"];
        $dosage = $_POST["medicine-{$medicineIndex}-dosage"] ?? '';
        $amount = $_POST["medicine-{$medicineIndex}-amount"] ?? null;
        $description = $_POST["medicine-{$medicineIndex}-description"] ?? '';
        
        // Validate amount
        $remainingAmount = null;
        if ($amount !== null && $amount !== '') {
            $amountInt = (int)$amount;
            if ($amountInt >= 1) {
                $remainingAmount = $amountInt;
            }
        }
        
        // Insert into prescriptiondetails
        // remainingAmount is set to the prescribed amount initially
        if ($remainingAmount !== null) {
            $sql_details = "INSERT INTO prescriptiondetails (prescID, medID, dosage, description, remainingAmount) VALUES (?, ?, ?, ?, ?)";
            $stmt_details = $conn->prepare($sql_details);
            $stmt_details->bind_param("ssssi", $prescID, $medID, $dosage, $description, $remainingAmount);
        } else {
            // If amount is invalid or not provided, insert with NULL
            $sql_details = "INSERT INTO prescriptiondetails (prescID, medID, dosage, description, remainingAmount) VALUES (?, ?, ?, ?, NULL)";
            $stmt_details = $conn->prepare($sql_details);
            $stmt_details->bind_param("ssss", $prescID, $medID, $dosage, $description);
        }
        
        if ($stmt_details->execute()) {
            $medicinesAdded++;
        }
        $stmt_details->close();
        
        $medicineIndex++;
    }
    
    if ($medicinesAdded > 0) {
        echo json_encode(['success' => true, 'prescID' => $prescID, 'medicinesAdded' => $medicinesAdded]);
    } else {
        echo json_encode(['error' => 'Prescription created but no medicines were added']);
    }
    
    $stmt_new_prescription->close();
} else {
    echo json_encode(['error' => 'Failed to create prescription: ' . $stmt_new_prescription->error]);
}

$conn->close();
?>