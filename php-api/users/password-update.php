<?php
// File: users/password-update.php
require_once '../config/origin.php'; 
require_once '../config/config.php'; 

header('Content-Type: application/json');
$pdo = getDB();

$data = json_decode(file_get_contents("php://input"), true);
$userId = $data['user_id'] ?? null;
$currentPassword = $data['current_password'] ?? '';
$newPassword = $data['new_password'] ?? '';

if (!$userId || !$currentPassword || !$newPassword) {
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit;
}

try {
    // 1. Fetch the existing hashed password
    $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($currentPassword, $user['password'])) {
        echo json_encode(["success" => false, "message" => "Current password is incorrect"]);
        exit;
    }

    // 2. Hash and Update
    $newHash = password_hash($newPassword, PASSWORD_BCRYPT);
    $update = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
    $update->execute([$newHash, $userId]);

    echo json_encode(["success" => true, "message" => "Password updated successfully"]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error"]);
}