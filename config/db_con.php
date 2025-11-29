<?php
$host = getenv('DB_HOST') ?: "localhost";      
$user = getenv('DB_USER') ?: "root";           
$pass = getenv('DB_PASSWORD') ?: "";               
$dbname = getenv('DB_NAME') ?: "team-berners-lee"; 

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}
?>
