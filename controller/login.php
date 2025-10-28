<?php
session_start();
include '../config/db_con.php';

$email = $_POST['email'];
$password = $_POST['password'];
$role = $_POST['role']; 

$table = "";
switch ($role) {
  case 'client': $table = 'client'; break;
  case 'doctor': $table = 'doctor'; break;
  case 'pharma': $table = 'pharmacist'; break;
  case 'admin': $table = 'admin'; break;
  default: die('Invalid role');
}

$sql = "SELECT * FROM $table WHERE email = ? AND password = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $email, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // Set a consistent session id across roles, handling varying PK column names
    $_SESSION['id'] = $user['clientID'] ?? $user['id'] ?? $user['doctorID'] ?? $user['pharmacistID'] ?? $user['adminID'] ?? null;
    $_SESSION['role'] = $role;

    switch ($role) {
        case 'client':
            
            header("Location: ../view/client/dashboard.php");
            break;
        case 'doctor':
            header("Location: ../view/doctor/dashboard.php");
            break;
        case 'pharma':
            header("Location: ../view/pharmacist/dashboard.php");
            break;
        case 'admin':
            header("Location: ../view/admin/dashboard.php");
            break;
    }
    exit();
} else {
    echo "Invalid credentials.";
}
?>
