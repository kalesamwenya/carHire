<?php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$pdo = getDB();

try {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || empty($data['visitor_id'])) {
        echo json_encode([
            "status" => "error",
            "message" => "Missing visitor_id"
        ]);
        exit;
    }

    $visitor_id = trim($data['visitor_id']);
    $email = !empty($data['email']) ? trim($data['email']) : null;

    // ================================
    // 1. FIND USER BY EMAIL (SAFE)
    // ================================
    $user_id = null;

    if ($email) {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $user_id = (int)$user['id'];
        }
    }

    // ================================
    // 2. SERVER IP (TRUSTED)
    // ================================
    $ip_address =
        $_SERVER['HTTP_X_FORWARDED_FOR'] ??
        $_SERVER['REMOTE_ADDR'] ??
        '0.0.0.0';

    // ================================
    // 3. PREVENT DUPLICATE VISITS (DAILY)
    // ================================
    $check = $pdo->prepare("
        SELECT id 
        FROM site_visits 
        WHERE visitor_id = ? 
        AND DATE(created_at) = CURDATE()
        LIMIT 1
    ");
    $check->execute([$visitor_id]);

    if ($check->fetch()) {
        echo json_encode([
            "status" => "skipped"
        ]);
        exit;
    }

    // ================================
    // 4. INSERT VISIT
    // ================================
    $stmt = $pdo->prepare("
        INSERT INTO site_visits (
            visitor_id,
            user_id,
            ip_address,
            device,
            os,
            platform,
            latitude,
            longitude,
            created_at
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, NOW()
        )
    ");

    $stmt->execute([
        $visitor_id,
        $user_id,
        $ip_address,
        $data['device'] ?? 'Unknown',
        $data['os'] ?? 'Unknown',
        $data['platform'] ?? 'Web',
        $data['lat'] ?? 0,
        $data['lng'] ?? 0
    ]);

    // ================================
    // 5. RESPONSE
    // ================================
    echo json_encode([
        "status" => "tracked",
        "visitor_id" => $visitor_id,
        "user_id" => $user_id,
        "ip" => $ip_address
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Server Error",
        "debug" => $e->getMessage()
    ]);
}