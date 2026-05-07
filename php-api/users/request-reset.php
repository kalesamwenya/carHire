<?php
// File: users/request-reset.php
require_once '../config/origin.php';
require_once '../config/config.php';
require_once '../config/EmailHelper.php';

$json = file_get_contents('php://input');
$data = json_decode($json);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_var($data->email, FILTER_SANITIZE_EMAIL);

    if (!$email) {
        http_response_code(400);
        echo json_encode(["message" => "Email is required."]);
        exit;
    }

    $pdo = getDB();

    try {
        // 1. Check if user exists
        $stmt = $pdo->prepare("SELECT id, name FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user) {
            // 2. Generate Reset Token
            $token = bin2hex(random_bytes(32));
            $expires = date('Y-m-d H:i:s', strtotime('+1 hour')); // Password resets usually expire faster (1hr)

            $update = $pdo->prepare("
                UPDATE users 
                SET verification_token = ?, 
                    token_expires = ? 
                WHERE id = ?
            ");
            $update->execute([$token, $expires, $user['id']]);

            // 3. Send Email
            // Note: You'll need to add sendPasswordReset to your EmailHelper
            EmailHelper::sendPasswordReset($email, $user['name'], $token);
        }

        // Always return success to prevent "email fishing"
        http_response_code(200);
        echo json_encode(["message" => "If an account exists, a reset link has been sent."]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error."]);
    }
}