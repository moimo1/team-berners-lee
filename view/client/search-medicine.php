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
    <title>Search Drug Info</title>
    <link rel="stylesheet" href="../../assets/css/header.css">
    <link rel="stylesheet" href="../../assets/css/client/dashboard.css">
    <link rel="stylesheet" href="../../assets/css/client/search-medicine.css">
    <link rel="stylesheet" href="../../assets/css/navbar.css">
</head>

<body class="has-sidebar">
    <?php include '../../includes/header.php'; ?>
    <main class="client-dashboard" id="clientDashboard">
        <?php 
        $currentPage = 'search-medicine';
        include '../../includes/sidebar.php'; 
        ?>

        <section class="item main-content">
            <h2 class="page-title">Search Drug Info</h2>
            
            <div class="card search-container">
                <form id="search-form" class="search-form">
                    <div class="search-input-group">
                        <select id="search-type" class="search-dropdown" aria-label="Search by">
                            <option value="genericName">Search by Generic Name</option>
                            <option value="brand">Search by Brand Name</option>
                        </select>
                        <input 
                            type="text" 
                            id="drug-name-input" 
                            name="query" 
                            placeholder="Type to search medicines..." 
                            class="search-input"
                            autocomplete="off"
                        />
                        <button type="submit" class="search-btn" aria-label="Search">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M19 19L14.65 14.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>

            <div class="card results-container">
                <div class="results-header">
                    <h3>Search Results</h3>
                </div>
                <div id="search-results" class="search-results">
                    <p class="no-results">Type a drug name above to search for medicine information.</p>
                </div>
            </div>
        </section>
    </main>


    <?php include '../../includes/footer.php'; ?>

    <script src="../../assets/js/search-medicine.js"></script>
</body>
</html>

