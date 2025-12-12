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
  case 'pharma_admin': $table = 'pharma_admin'; break;
  default: die('Invalid role');
}

$sql = "SELECT * FROM $table WHERE email = ? AND password = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $email, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    $_SESSION['role'] = $role;

    switch ($role) {
        case 'client':
            $_SESSION['id'] = $user['clientID'];
            header("Location: ../view/client/dashboard.php");
            break;

        case 'doctor':
            $_SESSION['id'] = $user['doctorID'];
            header("Location: ../view/doctor/dashboard.php");
            break;

        case 'pharma':
            $_SESSION['id'] = $user['pharmaID']; 
            header("Location: ../view/pharmacist/dashboard.php");
            break;

        case 'admin':
            $_SESSION['id'] = $user['adminID'];
            header("Location: ../view/admin/dashboard.php");
            break;
        case 'pharma_admin':
            $_SESSION['id'] = $user['id'];
            header("Location: ../view/pharmacist/admin/dashboard.php");
            break;
    }
    exit();
} else {
    // Invalid credentials - redirect back to login page with error
    header("Location: ../index.php?error=invalid_credentials");
    exit();
}

?>