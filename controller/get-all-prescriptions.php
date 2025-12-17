<?php 
session_start();
include '../config/db_con.php';

header('Content-Type: application/json');

/**
 * This endpoint returns all prescriptions visible to the pharmacist UI.
 *
 * To support the Pharmacist "History" tab, we enrich each prescription with:
 *  - isExpired: true when the prescription expiry date has passed
 *  - isFullyDispensed: true when ALL related prescriptiondetails rows have remainingAmount <= 0
 *
 * Notes:
 *  - Unlimited prescriptions (remainingAmount IS NULL) are never considered "fully dispensed".
 *  - A prescription with no details rows is treated as not fully dispensed.
 */

$query = "
    SELECT 
        p.prescID, 
        c.firstName AS clientFirstName, 
        c.lastName AS clientLastName, 
        p.dateGiven, 
        p.dateExpiry,
        -- Expired if the expiry date is strictly before today
        CASE 
            WHEN p.dateExpiry IS NOT NULL AND p.dateExpiry < CURDATE() THEN 1 
            ELSE 0 
        END AS isExpired,
        -- Fully dispensed when there are details and NONE have remainingAmount NULL or > 0
        CASE 
            WHEN COUNT(pd.prescID) = 0 THEN 0
            WHEN SUM(
                CASE 
                    WHEN pd.remainingAmount IS NULL OR pd.remainingAmount > 0 THEN 1
                    ELSE 0
                END
            ) = 0 THEN 1
            ELSE 0
        END AS isFullyDispensed
    FROM prescription p
    JOIN client c ON p.clientID = c.clientID
    LEFT JOIN prescriptiondetails pd ON pd.prescID = p.prescID
    GROUP BY 
        p.prescID,
        c.firstName,
        c.lastName,
        p.dateGiven,
        p.dateExpiry
    ORDER BY p.dateGiven DESC
";

$stmt = $conn->prepare($query);
$stmt->execute();
$result = $stmt->get_result();

$prescriptions = [];
while ($row = $result->fetch_assoc()) {
    // Cast flags to booleans for easier use on the frontend
    $row['isExpired'] = isset($row['isExpired']) ? (bool)$row['isExpired'] : false;
    $row['isFullyDispensed'] = isset($row['isFullyDispensed']) ? (bool)$row['isFullyDispensed'] : false;
    $prescriptions[] = $row;
}

echo json_encode($prescriptions);
?>
