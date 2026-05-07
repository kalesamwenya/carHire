<?php
// users/logout.php
require_once '../config/origin.php';
require_once '../config/config.php';

$headers = apache_request_headers();
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;

if ($authHeader && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    $token = $matches[1];
    $pdo = getDB();

    try {
        // Delete the specific session from the sessions table
        $stmt = $pdo->prepare("DELETE FROM sessions WHERE token = ?");
        $stmt->execute([$token]);
        
        http_response_code(200);
        echo json_encode(["message" => "Logged out successfully."]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Logout failed on server."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "No session token provided."]);
}