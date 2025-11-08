<?php $base = "http://localhost:8000"; ?>


<nav class="navbar">
    <h1 class="logo">MediTrack</h1>

    <ul class="nav-links">
        <?php if ($role === 'pharma'): ?>
            <li><a href="<?=$base ?>/view/pharmacist/dashboard.php">Home</a></li>
            <li><a href="<?=$base ?>/view/pharmacist/client-list.php">Patients</a></li>
            <li><a href="<?=$base ?>/view/pharmacist/inventory.php">Inventory</a></li>
        

        <?php elseif ($role === 'doctor'): ?>
            <li><a href="<?=$base ?>/view/doctor/dashboard.php">Dashboard</a></li>
            <li><a href="<?=$base ?>/view/doctor/patients.php">My Patients</a></li>
            <li><a href="<?=$base ?>/view/doctor/report.php">Reports</a></li>

        <?php elseif ($role === 'client'): ?>
            <li><a href="<?=$base ?>/view/client/dashboard.php">Home</a></li>
            <li><a href="<?=$base ?>/view/client/prescription-history.php">My Prescriptions</a></li>
            <li><a href="<?=$base ?>/view/client/profile.php">Profile</a></li>
        <?php endif; ?>

        <li><a href="/logout.php">Logout</a></li>
    </ul>
</nav>
