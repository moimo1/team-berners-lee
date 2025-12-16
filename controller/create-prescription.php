<?php
session_start();
include '../config/db_con.php';
header('Content-Type: application/json');

$doctorID = $_SESSION['id'];
$clientID = $_POST['client-id'] ?? null;
$date = $_POST['date-given'];
$expiry = $_POST['expiry-date'];
$status = $_POST['status'];

if (!$clientID) {
    echo json_encode(['error' => 'Client ID is required']);
    exit();
}

$sql_new_prescID = "SELECT prescID FROM prescription WHERE prescID LIKE 'P%' ORDER BY prescID DESC LIMIT 1";
$result = $conn->query($sql_new_prescID);

if ($result && $row = $result->fetch_assoc()) {
    $last_id = $row["prescID"];
    $number = (int)substr($last_id, strlen("P"));
} else {
    $number = 0;
}

$next_number = $number + 1;
$prescID = "P" . str_pad($next_number, 3, "0", STR_PAD_LEFT);

$sql_new_prescription = "INSERT INTO prescription (prescID, doctorID, clientID, dateGiven, dateExpiry) VALUES (?, ?, ?, ?, ?)";

$stmt_new_prescription = $conn->prepare($sql_new_prescription);
$stmt_new_prescription->bind_param("sssss", $prescID, $doctorID, $clientID, $date, $expiry);

if ($stmt_new_prescription->execute()) {
    $medicineIndex = 0;
    $medicinesAdded = 0;
    
    while (isset($_POST["medicine-{$medicineIndex}-id"])) {
        $medID = $_POST["medicine-{$medicineIndex}-id"];
        $dosage = $_POST["medicine-{$medicineIndex}-dosage"] ?? '';
        $amount = $_POST["medicine-{$medicineIndex}-amount"] ?? null;
        $description = $_POST["medicine-{$medicineIndex}-description"] ?? '';
        
        $remainingAmount = null;
        if ($amount !== null && $amount !== '') {
            $amountInt = (int)$amount;
            if ($amountInt >= 1) {
                $remainingAmount = $amountInt;
            }
        }
        
        if ($remainingAmount !== null) {
            $sql_details = "INSERT INTO prescriptiondetails (prescID, medID, dosage, description, remainingAmount) VALUES (?, ?, ?, ?, ?)";
            $stmt_details = $conn->prepare($sql_details);
            $stmt_details->bind_param("ssssi", $prescID, $medID, $dosage, $description, $remainingAmount);
        } else {
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
    
    if (isset($_POST['save-template']) && !empty($_POST['template-name'])) {
        $templateName = $_POST['template-name'];
        
        $medicinesArray = [];
        $medIdx = 0;
        
        while (isset($_POST["medicine-{$medIdx}-id"])) {
             $tMedID = $_POST["medicine-{$medIdx}-id"];
             $tDosage = $_POST["medicine-{$medIdx}-dosage"] ?? '';
             $tAmount = $_POST["medicine-{$medIdx}-amount"] ?? null;
             $tDesc = $_POST["medicine-{$medIdx}-description"] ?? '';
             
             $tRemaining = null;
             if ($tAmount !== null && $tAmount !== '') {
                 $tRemaining = (int)$tAmount;
             }

             $medicinesArray[] = [
                 'medID' => $tMedID,
                 'dosage' => $tDosage,
                 'amount' => $tRemaining,
                 'description' => $tDesc
             ];
             $medIdx++;
        }

        if (!empty($medicinesArray)) {
            $jsonMedicines = json_encode($medicinesArray);
            $sql_template = "INSERT INTO prescription_templates (doctorID, clientID, templateName, medicines) VALUES (?, ?, ?, ?)";
            $stmt_template = $conn->prepare($sql_template);
            $stmt_template->bind_param("ssss", $doctorID, $clientID, $templateName, $jsonMedicines);
            $stmt_template->execute();
            $stmt_template->close();
        }
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