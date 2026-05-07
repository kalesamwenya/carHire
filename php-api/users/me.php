<?php
// users/me.php
require_once '../config/origin.php';
require_once '../config/config.php';

$headers = apache_request_headers();
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;

if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized: No token provided"]);
    exit;
}

$token = $matches[1];
$pdo = getDB();

try {
    // 1. Join sessions with users to validate the specific token
    $stmt = $pdo->prepare("
        SELECT u.id, u.name, u.email, u.role, u.is_active, u.is_verified 
        FROM users u
        INNER JOIN sessions s ON u.id = s.user_id
        WHERE s.token = ? AND s.expires > NOW() AND u.is_active = TRUE
        LIMIT 1
    ");
    
    $stmt->execute([$token]);
    $user = $stmt->fetch();

    if ($user) {
        // 2. Check if the user is verified (7-day window logic)
        if (!$user['is_verified']) {
            http_response_code(403);
            echo json_encode([
                "authenticated" => true,
                "verified" => false,
                "message" => "Email verification required."
            ]);
            exit;
        }

        echo json_encode([
            "authenticated" => true,
            "user" => [
                "id" => $user['id'],
                "name" => $user['name'],
                "email" => $user['email'],
                "role" => $user['role'] // 'admin', 'super_admin', 'partner', or 'user'
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["authenticated" => false, "message" => "Session expired or invalid"]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
}