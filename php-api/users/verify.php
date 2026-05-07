<?php
// File: users/verify.php
require_once '../config/origin.php';
require_once '../config/config.php';

$token = $_GET['token'] ?? null;
$email = $_GET['email'] ?? null;

if (!$token || !$email) {
    http_response_code(400);
    echo json_encode(["message" => "Verification parameters missing."]);
    exit;
}

$pdo = getDB();

try {
    $stmt = $pdo->prepare("
        SELECT id, email FROM users 
        WHERE email = ? 
        AND verification_token = ? 
        AND (token_expires > NOW() OR token_expires IS NULL)
        AND is_verified = FALSE
    ");
    $stmt->execute([$email, $token]);
    $user = $stmt->fetch();

    if ($user) {
        $update = $pdo->prepare("
            UPDATE users 
            SET is_verified = TRUE, 
                verification_token = NULL, 
                token_expires = NULL 
            WHERE id = ?
        ");
        $update->execute([$user['id']]);

        // Check if the request is from Axios/Frontend (expects JSON)
        // or a direct link click (expects Redirect)
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false) {
            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "message" => "Account verified successfully!",
                "email" => $user['email']
            ]);
        } else {
            // Direct click from email
            $redirectUrl = "https://citydrivehire.com/auth/signin?verified=true&email=" . urlencode($user['email']);
            header("Location: " . $redirectUrl);
        }
        exit;
    } else {
        http_response_code(400);
        echo json_encode(["message" => "This link is invalid, expired, or the account is already verified."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error: " . $e->getMessage()]);
}