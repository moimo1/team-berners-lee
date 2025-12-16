<?php
session_start();
include '../config/db_con.php';
header('Content-Type: application/json');

if (!isset($_SESSION['id']) || $_SESSION['role'] !== 'pharma') {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized", "message" => "Please log in as a pharmacist."]);
    exit;
}

$prescID = isset($_POST['prescID']) ? trim($_POST['prescID']) : '';
$medID = isset($_POST['medID']) ? trim($_POST['medID']) : '';
$purchaseAmount = isset($_POST['amount']) ? (int)$_POST['amount'] : 0;

if (empty($prescID) || empty($medID)) {
    http_response_code(400);
    echo json_encode(["error" => "Bad Request", "message" => "Prescription ID and Medicine ID are required."]);
    exit;
}

if ($purchaseAmount <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "Bad Request", "message" => "Purchase amount must be greater than 0."]);
    exit;
}

$sql_check = "
    SELECT remainingAmount 
    FROM prescriptiondetails 
    WHERE prescID = ? AND medID = ?
";

$stmt_check = $conn->prepare($sql_check);
if (!$stmt_check) {
    http_response_code(500);
    echo json_encode(["error" => "Database Error", "message" => "Failed to prepare statement."]);
    exit;
}

$stmt_check->bind_param("ss", $prescID, $medID);
$stmt_check->execute();
$result_check = $stmt_check->get_result();
$current = $result_check->fetch_assoc();

if (!$current) {
    http_response_code(404);
    echo json_encode(["error" => "Not Found", "message" => "Prescription detail not found."]);
    exit;
}

$currentAmount = $current['remainingAmount'];

if ($currentAmount === null) {
    echo json_encode([
        "success" => true,
        "message" => "Purchase completed successfully (unlimited prescription).",
        "remainingAmount" => null
    ]);
    exit;
}

if ($purchaseAmount > $currentAmount) {
    http_response_code(400);
    echo json_encode([
        "error" => "Invalid Amount",
        "message" => "Amount is greater than prescribed limit.",
        "remainingAmount" => $currentAmount
    ]);
    exit;
}

$newRemainingAmount = $currentAmount - $purchaseAmount;

$sql_update = "
    UPDATE prescriptiondetails 
    SET remainingAmount = ? 
    WHERE prescID = ? AND medID = ?
";

$stmt_update = $conn->prepare($sql_update);
if (!$stmt_update) {
    http_response_code(500);
    echo json_encode(["error" => "Database Error", "message" => "Failed to prepare update statement."]);
    exit;
}

$stmt_update->bind_param("iss", $newRemainingAmount, $prescID, $medID);

    if (!$stmt_update->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Database Error", "message" => $stmt_update->error]);
    exit;
}

$pharmaID = $_SESSION['id'];
$sql_dispense = "INSERT INTO dispense (prescID, pharmaID, dateDispensed) VALUES (?, ?, NOW())";
$stmt_dispense = $conn->prepare($sql_dispense);
if ($stmt_dispense) {
    $stmt_dispense->bind_param("ss", $prescID, $pharmaID);
    if ($stmt_dispense->execute()) {
        $dispenseID = $stmt_dispense->insert_id;
        
        $sql_item = "INSERT INTO dispense_items (dispenseID, medID, quantitySold, priceAtSale) VALUES (?, ?, ?, NULL)";
        $stmt_item = $conn->prepare($sql_item);
        if ($stmt_item) {
            $stmt_item->bind_param("isi", $dispenseID, $medID, $purchaseAmount);
            $stmt_item->execute();
            $stmt_item->close();
        }
    }
    $stmt_dispense->close();
}

echo json_encode([
    "success" => true,
    "message" => "Purchase completed successfully.",
    "purchasedAmount" => $purchaseAmount,
    "remainingAmount" => $newRemainingAmount
]);

$stmt_check->close();
$stmt_update->close();
$conn->close();
?>

