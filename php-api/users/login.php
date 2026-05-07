<?php
// users/login.php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

$json = file_get_contents('php://input');
$data = json_decode($json);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($data->email) || !isset($data->password)) {
        http_response_code(400);
        echo json_encode(["message" => "Email and password required."]);
        exit;
    }

    $email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
    $password = $data->password;

    $pdo = getDB();

    try {
        // UPDATED: Joined with partners_about to get kyc_status
        $stmt = $pdo->prepare("
            SELECT 
                u.id, u.name, u.email, u.image, u.role, u.password, u.is_active, 
                pa.kyc_status 
            FROM users u
            LEFT JOIN partner_about pa ON u.id = pa.user_id
            WHERE u.email = ?
        ");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            if (!$user['is_active']) {
                http_response_code(403);
                echo json_encode(["message" => "Account is deactivated."]);
                exit;
            }

            $token = bin2hex(random_bytes(32)); 
            $userId = $user['id'];
            $expiry = date('Y-m-d H:i:s', strtotime('+30 days'));

            $sessionStmt = $pdo->prepare("
                INSERT INTO sessions (user_id, token, expires_at) 
                VALUES (?, ?, ?)
            ");
            $sessionStmt->execute([$userId, $token, $expiry]);

            echo json_encode([
                "success" => true,
                "token" => $token,
                "user" => [
                    "id" => $user['id'],
                    "name" => $user['name'],
                    "email" => $user['email'],
                    "role" => $user['role'],
                    "profile" => $user['image'],
                    // If no entry exists in partners_about yet, return null
                    "kyc_status" => $user['kyc_status'] ?? null, 
                    "status" => $user['is_active'] ? 'active' : 'inactive'
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Invalid email or password."]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Database error: " . $e->getMessage()]);
    }
}