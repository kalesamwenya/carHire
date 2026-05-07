<?php
// File: admin/add-member.php
require_once '../config/origin.php';
require_once '../config/config.php';
require_once '../config/EmailHelper.php';

header('Content-Type: application/json');

$json = file_get_contents('php://input');
$data = json_decode($json);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (empty($data->name) || empty($data->email) || empty($data->role)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Name, email, and role are required."]);
        exit;
    }

    $name = strip_tags($data->name);
    $email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
    $incomingRole = $data->role; // super_admin, fleet_manager, support

    $rawPassword = bin2hex(random_bytes(4)); 
    $hashedPassword = password_hash($rawPassword, PASSWORD_BCRYPT);
    $token = bin2hex(random_bytes(32)); 
    $expires = date('Y-m-d H:i:s', strtotime('+7 days'));

    $pdo = getDB();

    try {
        $pdo->beginTransaction();

        // 1. Insert into 'users' table
        $stmt = $pdo->prepare("
            INSERT INTO users (
                name, email, password, role, 
                residency, driver_license, 
                verification_token, token_expires, 
                is_verified, is_active, created_at
            ) VALUES (?, ?, ?, 'admin', 'Zambia', 'N/A', ?, ?, 1, 1, NOW())
        ");
        $stmt->execute([$name, $email, $hashedPassword, $token, $expires]);
        $userId = $pdo->lastInsertId();

        // 2. Map Access Levels
        $accessLevel = 1;
        if ($incomingRole === 'super_admin') $accessLevel = 10;
        elseif ($incomingRole === 'fleet_manager') $accessLevel = 5;

        // 3. Insert into 'admins' table
        // We now use the actual role name as the permission string since we removed the constraint
        $adminStmt = $pdo->prepare("
            INSERT INTO admins (user_id, access_level, permissions, is_active, created_at) 
            VALUES (?, ?, ?, 1, NOW())
        ");
        
        $adminStmt->execute([$userId, $accessLevel, $incomingRole]);

        // 4. Send Branded SMTP Email
        EmailHelper::sendAdminInvitation($email, $name, $incomingRole, $rawPassword);

        $pdo->commit();

        echo json_encode([
            "success" => true,
            "message" => "Team member invited successfully."
        ]);

    } catch (PDOException $e) {
        if ($pdo->inTransaction()) { $pdo->rollBack(); }
        
        http_response_code(500);
        echo json_encode([
            "success" => false, 
            "message" => "Database Error: " . $e->getMessage()
        ]);
    }
}