<?php
// config.php
define('DB_HOST', 'localhost');
define('DB_NAME', 'u164973018_citydrivehire');
define('DB_USER', 'u164973018_citydrivehire');
define('DB_PASS', '@Citydrive26');

function getDB() {
    $host = DB_HOST;
    $db   = DB_NAME;
    $user = DB_USER;
    $pass = DB_PASS;
    $charset = 'utf8mb4';

    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        return new PDO($dsn, $user, $pass, $options);
    } catch (\PDOException $e) {
        // Log error and exit safely
        error_log($e->getMessage());
        http_response_code(500);
        echo json_encode(["message" => "Database connection failed"]);
        exit;
    }
}