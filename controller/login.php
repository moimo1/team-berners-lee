<?php
session_start();
include '../config/db_con.php';

$username = $_POST['username'];
$password = $_POST['password'];
$role = $_POST['role']; 

$table = "";
switch ($role) {
  case 'client': $table = 'clients'; break;
  case 'doctor': $table = 'doctors'; break;
  case 'pharma': $table = 'pharmacists'; break;
  case 'admin': $table = 'admins'; break;
  default: die('Invalid role');
}

$sql = "SELECT * FROM $table WHERE username = ? AND password = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['role'] = $role;

    switch ($role) {
        case 'client':
            header("Location: ./view/client/dashboard.php");
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
