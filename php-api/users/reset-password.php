<?php
// File: users/reset-password.php
require_once '../config/origin.php';
require_once '../config/config.php';

$json = file_get_contents('php://input');
$data = json_decode($json);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = $data->token ?? null;
    $email = $data->email ?? null;
    $newPassword = $data->password ?? null;

    if (!$token || !$email || !$newPassword) {
        http_response_code(400);
        echo json_encode(["message" => "Missing required data."]);
        exit;
    }

    $pdo = getDB();

    try {
        // 1. Validate Token and Expiry
        $stmt = $pdo->prepare("
            SELECT id FROM users 
            WHERE email = ? AND verification_token = ? AND token_expires > NOW()
        ");
        $stmt->execute([$email, $token]);
        $user = $stmt->fetch();

        if (!$user) {
            http_response_code(400);
            echo json_encode(["message" => "Invalid or expired reset link."]);
            exit;
        }

        // 2. Hash and Update
        $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
        $update = $pdo->prepare("
            UPDATE users 
            SET password = ?, 
                verification_token = NULL, 
                token_expires = NULL 
            WHERE id = ?
        ");
        $update->execute([$hashedPassword, $user['id']]);

        echo json_encode(["status" => "success", "message" => "Password updated successfully."]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Internal server error."]);
    }
}