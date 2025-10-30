<?php
    session_start();
    $role = 'client';
    include '../../includes/navbar.php';
    
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Client Dashboard</title>

    <link rel="stylesheet" href="../../assets/css/client/dashboard.css">
</head>

<body>
    <main class="client-dashboard">

        <!-- all header elements will stay here -->
        <section class="item header">Header</section>

        <!-- all sidebar elements stay here -->
        <section class="item sidebar">Sidebar</section>
        
        <!-- all main content elements stay here -->
        <section class="item main-content">
            <div class="prescription-list"></div>


            <!-- for testing purposes -->
            <button id="sample">Click</button>
        </section>
    
    </main>

    <?php include '../../includes/footer.php'; ?>

    <script src="../../assets/js/get-prescription.js"></script>
</body>

</html>
