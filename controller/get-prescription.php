<?php 
session_start();

include '../config/db_con.php';
header('Content-Type: application/json');

// Check if prescID is provided as parameter
if (isset($_GET['prescID'])) {
    $prescID = trim($_GET['prescID']);
} else {
    // Fallback to most recent prescription for the logged-in client
    if (!isset($_SESSION['id'])) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }
    $clientID = $_SESSION['id'];
    
    $sql = "SELECT * FROM prescription WHERE clientID = ? ORDER BY dateGiven DESC LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $clientID);
    $ok = $stmt->execute();
    if (!$ok) {
        http_response_code(500);
        echo json_encode(["error" => "execute_failed", "message" => $stmt->error]);
        exit;
    }
    $result = $stmt->get_result();
    $prescription = $result->fetch_assoc();
    $stmt->close();
    
    if (!$prescription) {
        echo json_encode([]);
        exit;
    }
    
    $prescID = trim($prescription["prescID"]);
}

// Convert prescID from 'P001' format to 'PD001' format for prescriptiondetails table
$prescIDForDetails = 'PD' . substr($prescID, 1);

// Get prescription header info
$sql_presc = "SELECT * FROM prescription WHERE prescID = ?";
$stmt_presc = $conn->prepare($sql_presc);
$stmt_presc->bind_param("s", $prescID);
$stmt_presc->execute();
$result_presc = $stmt_presc->get_result();
$prescription = $result_presc->fetch_assoc();
$stmt_presc->close();

if (!$prescription) {
    echo json_encode([]);
    exit;
}

// Get details for the prescription
$sql_prescDetails = "SELECT pd.*, m.* 
                    FROM prescriptiondetails pd 
                    JOIN medicine m ON pd.medID = m.medID
                    WHERE pd.prescID = ?";
$stmt_details = $conn->prepare($sql_prescDetails);
$stmt_details->bind_param("s", $prescIDForDetails);
$ok2 = $stmt_details->execute();

if (!$ok2) {
    http_response_code(500);
    echo json_encode(["error" => "execute_failed", "message" => $stmt_details->error]);
    exit;
}

$result_details = $stmt_details->get_result();

$data = [];
while ($row = $result_details->fetch_assoc()) {
    $row["dateExpiry"] = $prescription["dateExpiry"];
    $row["dateGiven"] = $prescription["dateGiven"];
    $row["prescID"] = $prescription["prescID"];
    $data[] = $row;
}
$stmt_details->close();

echo json_encode($data);
?>
