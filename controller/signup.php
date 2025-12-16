<?php
session_start();
include '../config/db_con.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: ../view/SignUp.php?error=Invalid request method");
    exit();
}

$role = $_POST['role'] ?? '';
$firstName = trim($_POST['firstName'] ?? '');
$lastName = trim($_POST['lastName'] ?? '');

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$confirmPassword = $_POST['confirmPassword'] ?? '';
$contacts = trim($_POST['contacts'] ?? '');
$address = trim($_POST['address'] ?? '');

if (empty($role) || empty($firstName) || empty($lastName) || empty($email) || empty($password)) {
    header("Location: ../view/SignUp.php?role=$role&error=Please fill in all required fields");
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: ../view/SignUp.php?role=$role&error=Invalid email format");
    exit();
}

if (strlen($password) < 3) {
    header("Location: ../view/SignUp.php?role=$role&error=Password must be at least 3 characters long");
    exit();
}

if ($password !== $confirmPassword) {
    header("Location: ../view/SignUp.php?role=$role&error=Passwords do not match");
    exit();
}
if ($role === 'doctor') {
    $specialization = trim($_POST['specialization'] ?? '');
    if (empty($specialization)) {
        header("Location: ../view/SignUp.php?role=$role&error=Specialization is required for doctors");
        exit();
    }
}

if ($role === 'pharmacist') {
    $designation = trim($_POST['designation'] ?? '');
    if (empty($designation)) {
        header("Location: ../view/SignUp.php?role=$role&error=Designation is required for pharmacists");
        exit();
    }
}

if ($role === 'doctor' && empty($contacts)) {
    header("Location: ../view/SignUp.php?role=$role&error=Contact number is required for doctors");
    exit();
}

if ($role === 'client' && empty($address)) {
    header("Location: ../view/SignUp.php?role=$role&error=Address is required for clients");
    exit();
}

$profilePhotoPath = null;
$licensePicturePath = null;
$uploadDir = '../uploads/';
$allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
$maxFileSize = 5 * 1024 * 1024;

if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}
if (isset($_FILES['profilePhoto']) && $_FILES['profilePhoto']['error'] === UPLOAD_ERR_OK) {
    $profilePhoto = $_FILES['profilePhoto'];
    
    $fileType = mime_content_type($profilePhoto['tmp_name']);
    if (!in_array($fileType, $allowedImageTypes)) {
        header("Location: ../view/SignUp.php?role=$role&error=Profile photo must be an image file (JPEG, PNG, or GIF)");
        exit();
    }
    
    if ($profilePhoto['size'] > $maxFileSize) {
        header("Location: ../view/SignUp.php?role=$role&error=Profile photo must be less than 5MB");
        exit();
    }
    
    $profileExt = pathinfo($profilePhoto['name'], PATHINFO_EXTENSION);
    $profileFileName = 'profile_' . time() . '_' . uniqid() . '.' . $profileExt;
    $profilePhotoPath = $uploadDir . $profileFileName;
    
    if (move_uploaded_file($profilePhoto['tmp_name'], $profilePhotoPath)) {
        $profilePhotoPath = 'uploads/' . $profileFileName;
    }
}

if (($role === 'doctor' || $role === 'pharmacist') && 
    isset($_FILES['licensePicture']) && $_FILES['licensePicture']['error'] === UPLOAD_ERR_OK) {
    $licensePicture = $_FILES['licensePicture'];
    
    $fileType = mime_content_type($licensePicture['tmp_name']);
    if (!in_array($fileType, $allowedImageTypes)) {
        header("Location: ../view/SignUp.php?role=$role&error=License picture must be an image file (JPEG, PNG, or GIF)");
        exit();
    }
    
    if ($licensePicture['size'] > $maxFileSize) {
        header("Location: ../view/SignUp.php?role=$role&error=License picture must be less than 5MB");
        exit();
    }
    
    $licenseExt = pathinfo($licensePicture['name'], PATHINFO_EXTENSION);
    $licenseFileName = 'license_' . time() . '_' . uniqid() . '.' . $licenseExt;
    $licensePicturePath = $uploadDir . $licenseFileName;
    
    if (move_uploaded_file($licensePicture['tmp_name'], $licensePicturePath)) {
        $licensePicturePath = 'uploads/' . $licenseFileName;
    }
}

$prefix = '';
$table = '';
$idColumn = '';
$substringStart = 2;

switch ($role) {
    case 'doctor':
        $prefix = 'D';
        $table = 'doctor';
        $idColumn = 'doctorID';
        $specialization = trim($_POST['specialization'] ?? '');
        break;
    case 'pharmacist':
        $prefix = 'PH';
        $table = 'pharmacist';
        $idColumn = 'pharmaID';
        $substringStart = 3;
        $designation = trim($_POST['designation'] ?? '');
        break;
    case 'client':
        $prefix = 'C';
        $table = 'client';
        $idColumn = 'clientID';
        break;
    default:
        header("Location: ../view/SignUp.php?error=Invalid role selected");
        exit();
}

$sql = "SELECT MAX(CAST(SUBSTRING($idColumn, $substringStart) AS UNSIGNED)) as maxNum FROM $table";
$result = $conn->query($sql);
if (!$result) {
    header("Location: ../view/SignUp.php?role=$role&error=Database error occurred");
    exit();
}

$row = $result->fetch_assoc();
$nextNum = ($row['maxNum'] ?? 0) + 1;

if ($role === 'pharmacist') {
    $newID = $prefix . str_pad($nextNum, 3, '0', STR_PAD_LEFT); 
} else {
    $newID = $prefix . str_pad($nextNum, 3, '0', STR_PAD_LEFT); 
}

$checkEmail = "SELECT * FROM $table WHERE email = ?";
$stmtCheck = $conn->prepare($checkEmail);
if (!$stmtCheck) {
    header("Location: ../view/SignUp.php?role=$role&error=Database error occurred");
    exit();
}

$stmtCheck->bind_param("s", $email);
$stmtCheck->execute();
$resultCheck = $stmtCheck->get_result();

if ($resultCheck->num_rows > 0) {
    $stmtCheck->close();
    header("Location: ../view/SignUp.php?role=$role&error=Email already exists. Please use a different email.");
    exit();
}
$stmtCheck->close();

$stmt = null;
if ($role === 'doctor') {
    $sql = "INSERT INTO $table ($idColumn, firstName, lastName, specialty, phonenum, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        header("Location: ../view/SignUp.php?role=$role&error=Database error: " . $conn->error);
        exit();
    }
    $stmt->bind_param("sssssss", $newID, $firstName, $lastName, $specialization, $contacts, $email, $password);
} elseif ($role === 'pharmacist') {
    $sql = "INSERT INTO $table ($idColumn, firstName, lastName, location, email, password) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        header("Location: ../view/SignUp.php?role=$role&error=Database error: " . $conn->error);
        exit();
    }
    $location = $designation ?? '';
    $stmt->bind_param("ssssss", $newID, $firstName, $lastName, $location, $email, $password);
} elseif ($role === 'client') {
    $sql = "INSERT INTO $table ($idColumn, firstName, lastName, address, email, password) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        header("Location: ../view/SignUp.php?role=$role&error=Database error: " . $conn->error);
        exit();
    }
    $stmt->bind_param("ssssss", $newID, $firstName, $lastName, $address, $email, $password);
}

if ($stmt && $stmt->execute()) {
    $stmt->close();
    header("Location: ../index.php?success=Account created successfully! Please login.");
    exit();
} else {
    $errorMsg = $stmt ? $stmt->error : "Failed to prepare statement";
    if ($stmt) $stmt->close();
    header("Location: ../view/SignUp.php?role=$role&error=Failed to create account. " . $errorMsg);
    exit();
}

$conn->close();
?>

