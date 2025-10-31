<?php
session_start();
$role = 'doctor';
include '../../includes/navbar.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Doctor's Dashboard</title>
    <link rel="stylesheet" href="../../assets/css/doctor/dashboard.css">
    <link rel="stylesheet" href="../../assets/css/navbar.css">
</head>
<body>

<div class="doctor-dashboard">
    <!-- Header -->
    <div class="item header">
        <h1>Doctor Dashboard</h1>
    </div>

    <!-- Sidebar -->
    <div class="item sidebar">
        <ul>
            <li><a href="#">Dashboard</a></li>
            <li><a href="#">My Patients</a></li>
            <li><a href="#">Reports</a></li>
        </ul>
    </div>

    <!-- Main Content -->
    <div class="item main-content">
        <h2>Welcome, Doctor!</h2>
    </div>
</div>

<?php include '../../includes/footer.php'; ?>

</body>
</html>
