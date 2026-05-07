<?php
require_once '../config/origin.php'; // Ensure this handles CORS headers
require_once '../config/config.php';

// 1. Get the JSON payload first
$data = json_decode(file_get_contents("php://input"), true);

// 2. Extract values
$currentPassword = $data['currentPassword'] ?? '';
$newPassword = $data['newPassword'] ?? '';
$userId = $data['user_id'] ?? null; 

// 3. NOW check if userId exists
if (!$userId) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized access: No User ID provided."]);
    exit;
}

if (strlen($newPassword) < 8) {
    http_response_code(400);
    echo json_encode(["message" => "New password must be at least 8 characters."]);
    exit;
}

$pdo = getDB();

try {
    // 4. Fetch the current hash for this specific user
    $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    // 5. Verify the old password matches what's in the DB
    if (!$user || !password_verify($currentPassword, $user['password'])) {
        http_response_code(401);
        echo json_encode(["message" => "Current password is incorrect."]);
        exit;
    }

    // 6. Hash new password and update
    $newHash = password_hash($newPassword, PASSWORD_BCRYPT);
    $update = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
    $update->execute([$newHash, $userId]);

    echo json_encode(["message" => "Password updated successfully."]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database error."]);
}