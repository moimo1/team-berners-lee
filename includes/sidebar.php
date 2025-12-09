<?php
if (!isset($currentPage)) {
    $currentPage = '';
}
$role = isset($_SESSION['role']) ? $_SESSION['role'] : 'client';
?>

<!-- Sidebar CSS -->
<link rel="stylesheet" href="/assets/css/sidebar.css">

<aside class="sidebar" aria-label="Sidebar navigation">
    <nav class="sidebar-nav">
        <ul>
            <?php if ($role === 'client'): ?>
                <li><a href="/view/client/dashboard.php" class="nav-item <?php echo $currentPage === 'dashboard' ? 'active' : ''; ?>" aria-label="Home"><span class="icon" aria-hidden="true"><img src="/assets/icons/home.svg" alt=""></span><span class="label">Home</span></a></li>
                <li><a href="/view/client/prescription-details.php" class="nav-item <?php echo $currentPage === 'prescription-details' ? 'active' : ''; ?>" aria-label="My Prescription"><span class="icon" aria-hidden="true"><img src="/assets/icons/prescription.svg" alt=""></span><span class="label">My Prescription</span></a></li>
                <li><a href="/view/client/prescription-history.php" class="nav-item <?php echo $currentPage === 'prescription-history' ? 'active' : ''; ?>" aria-label="Prescription History"><span class="icon" aria-hidden="true"><img src="/assets/icons/history.svg" alt=""></span><span class="label">Prescription History</span></a></li>
                <li><a href="/view/client/search-medicine.php" class="nav-item <?php echo $currentPage === 'search-medicine' ? 'active' : ''; ?>" aria-label="Search"><span class="icon" aria-hidden="true"><img src="/assets/icons/search.svg" alt=""></span><span class="label">Search</span></a></li>
            <?php elseif ($role === 'doctor'): ?>
                <li><a href="/view/doctor/dashboard.php" class="nav-item <?php echo $currentPage === 'dashboard' ? 'active' : ''; ?>" aria-label="Dashboard"><span class="icon" aria-hidden="true"><img src="/assets/icons/home.svg" alt=""></span><span class="label">Dashboard</span></a></li>
                <li><a href="/view/doctor/prescriptions.php" class="nav-item <?php echo $currentPage === 'prescriptions' ? 'active' : ''; ?>" aria-label="Prescriptions"><span class="icon" aria-hidden="true"><img src="/assets/icons/prescription.svg" alt=""></span><span class="label">Prescriptions</span></a></li>
                <li><a href="/view/doctor/create-prescription-form.php" class="nav-item <?php echo $currentPage === 'create-prescription' ? 'active' : ''; ?>" aria-label="Create Prescription"><span class="icon" aria-hidden="true"><img src="/assets/icons/prescription.svg" alt=""></span><span class="label">Create Prescription</span></a></li>
            <?php elseif ($role === 'pharma'): ?>
                <li><a href="/view/pharmacist/dashboard.php" class="nav-item <?php echo $currentPage === 'dashboard' ? 'active' : ''; ?>" aria-label="Dashboard"><span class="icon" aria-hidden="true"><img src="/assets/icons/home.svg" alt=""></span><span class="label">Dashboard</span></a></li>
                <li><a href="/view/pharmacist/client-list.php" class="nav-item <?php echo $currentPage === 'client-list' ? 'active' : ''; ?>" aria-label="Prescriptions"><span class="icon" aria-hidden="true"><img src="/assets/icons/prescription.svg" alt=""></span><span class="label">Prescriptions</span></a></li>
            <?php elseif ($role === 'pharma_admin'): ?>
                <li><a href="/view/pharmacist/admin/dashboard.php" class="nav-item <?php echo $currentPage === 'pharma-admin-dashboard' ? 'active' : ''; ?>" aria-label="Dashboard"><span class="icon" aria-hidden="true"><img src="/assets/icons/home.svg" alt=""></span><span class="label">Dashboard</span></a></li>
                <li><a href="/view/pharmacist/admin/prescriptions.php" class="nav-item <?php echo $currentPage === 'pharma-admin-prescriptions' ? 'active' : ''; ?>" aria-label="Prescriptions by Pharmacist"><span class="icon" aria-hidden="true"><img src="/assets/icons/prescription.svg" alt=""></span><span class="label">Prescriptions</span></a></li>
            <?php endif; ?>
        </ul>
    </nav>
    <button class="sidebar-toggle" id="sidebarToggle" aria-label="Toggle sidebar" aria-expanded="false"></button>
    <div class="sidebar-footer">
        <ul>
            <li><a href="#" class="nav-item <?php echo $currentPage === 'profile' ? 'active' : ''; ?>" aria-label="Profile"><span class="icon" aria-hidden="true"><img src="/assets/icons/profile.svg" alt=""></span><span class="label">Profile</span></a></li>
            <li><a href="/logout.php" class="nav-item" aria-label="Logout"><span class="icon" aria-hidden="true"><img src="/assets/icons/logout.svg" alt=""></span><span class="label">Logout</span></a></li>
        </ul>
    </div>
</aside>

<script>
(function(){
    var dashboard = document.getElementById('clientDashboard');
    var toggle = document.getElementById('sidebarToggle');
    if (dashboard && toggle) {
        toggle.addEventListener('click', function(){
            dashboard.classList.toggle('sidebar-expanded');
            var expanded = dashboard.classList.contains('sidebar-expanded');
            toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        });
    }
})();
</script>

