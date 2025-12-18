<?php 
session_start();
include '../config/db_con.php';

header('Content-Type: application/json');

// Fetch all prescriptions with basic client info plus flags that help us
// determine whether a prescription is expired or fully dispensed.
$query = "
    SELECT 
        p.prescID, 
        c.firstName AS clientFirstName, 
        c.lastName AS clientLastName, 
        p.dateGiven, 
        p.dateExpiry,
        (p.dateExpiry IS NOT NULL AND p.dateExpiry < CURDATE()) AS isExpired,
        SUM(
            CASE 
                WHEN pd.remainingAmount IS NULL OR pd.remainingAmount > 0 
                    THEN 1 
                ELSE 0 
            END
        ) AS hasRemainingLines
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
    // Derive a simple boolean-style flag the frontend can use to know if a
    // prescription is fully dispensed. A prescription is considered fully
    // dispensed when there are no lines with a remainingAmount > 0 or NULL
    // (NULL is treated as "unlimited", so that keeps it active).
    $hasRemainingLines = isset($row['hasRemainingLines']) ? (int)$row['hasRemainingLines'] : 0;
    $row['isFullyDispensed'] = ($hasRemainingLines === 0) ? 1 : 0;

    // We don't need to expose the internal aggregate field directly.
    unset($row['hasRemainingLines']);

    $prescriptions[] = $row;
}

echo json_encode($prescriptions);
?>
