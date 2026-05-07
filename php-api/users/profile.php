<?php
// File: users/profile.php
require_once '../config/origin.php'; 
require_once '../config/config.php'; 

header('Content-Type: application/json');
$pdo = getDB();

$method = $_SERVER['REQUEST_METHOD'];

// 1. FETCH PROFILE WITH JOIN (GET)
if ($method === 'GET') {
    $userId = $_GET['user_id'] ?? null; 

    if (!$userId) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "User ID required"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT 
                u.id, u.name, u.email, u.phone, u.driver_license, u.role, u.image,
                ua.bio, ua.location, ua.hobbies
            FROM users u
            LEFT JOIN users_about ua ON u.id = ua.user_id
            WHERE u.id = ?
        ");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            echo json_encode($user);
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "User not found"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
} 

// 2. UPDATE PROFILE & ABOUT TABLE (POST)
else if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $userId = $data['user_id'] ?? null;

    if (!$userId) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "User ID required"]);
        exit;
    }

    try {
        $pdo->beginTransaction();

        // Update main users table
        $stmt1 = $pdo->prepare("UPDATE users SET phone = ?, driver_license = ? WHERE id = ?");
        $stmt1->execute([$data['phone'], $data['driver_license'], $userId]);

        // Update or Insert into users_about table
        $stmt2 = $pdo->prepare("
            INSERT INTO users_about (user_id, bio, location, hobbies) 
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE bio = VALUES(bio), location = VALUES(location), hobbies = VALUES(hobbies)
        ");
        $stmt2->execute([$userId, $data['bio'], $data['location'], $data['hobbies']]);

        $pdo->commit();
        echo json_encode(["success" => true, "message" => "Profile and Bio updated"]);
    } catch (PDOException $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}