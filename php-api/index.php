<?php
// FILE: index.php
require_once __DIR__ . '/config/origin.php'; // Removed the '<' typo

$requestUri = $_SERVER['REQUEST_URI'];
// If your script is inside a folder named 'api', set this to '/api'
$path = parse_url($requestUri, PHP_URL_PATH);
$path = trim($path, '/');

// Routing Logic
switch ($path) {
    case 'users/register':
    case 'users/register.php': // Support both formats
        require __DIR__ . '/users/register.php';
        break;

    case 'users/verify':
        require __DIR__ . '/users/verify.php';
        break;

    default:
        http_response_code(404);
        echo json_encode(["error" => "Route not found", "path" => $path]);
        break;
}