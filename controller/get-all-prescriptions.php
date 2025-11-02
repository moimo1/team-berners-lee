<?php 
    session_start();
    $role = $_SESSION['role'];
    include '../config/db_con.php';

    $query = "SELECT p.prescID, c.firstName AS clientFirstName, c.lastName AS clientLastName, p.dateGiven, p.dateExpiry
              FROM prescription p
              JOIN client c ON p.clientID = c.clientID
              ORDER BY p.dateGiven ASC LIMIT 10";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $result = $stmt->get_result();
    $prescriptions = [];
    while ($row = $result->fetch_assoc()) {
        $prescriptions[] = $row;
    }
    echo json_encode($prescriptions);
?>