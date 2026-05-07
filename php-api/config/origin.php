<?php
/**
 * origin.php - Centralized CORS and Security Headers
 */

// 1. Define allowed origins
$allowed_origins = [
    "http://localhost:3000",
    "https://citydrivehire.com",
    "https://www.citydrivehire.com", // Include www variant
    "https://www.citydrivehire.com",
    "https://carhire-itts-git-master-emit-arts-and-creatives.vercel.app"
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $origin);
} elseif (empty($origin)) {
    // Allows direct server-to-server calls or tool testing (like Postman)
    header("Access-Control-Allow-Origin: *");
}

// 2. Standard CORS Headers
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 86400"); // Cache preflight for 24 hours

// 3. Security & Content Type
header("Content-Type: application/json; charset=UTF-8");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN"); // Changed from DENY to allow same-site iframes if needed
header("X-XSS-Protection: 1; mode=block");

// 4. Handle "Preflight" OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Some servers need a 200 OK instead of 204
    http_response_code(200); 
    exit;
}