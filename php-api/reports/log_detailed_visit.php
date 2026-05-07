<?php
// Handle CORS Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Max-Age: 86400");
    exit(0); // Stop here for preflight
}

// Standard Headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");

require_once '../config/origin.php';
require_once '../config/config.php';

$data = json_decode(file_get_contents("php://input"), true);
$pdo = getDB();

try {


    if ($data && isset($data['visitor_id'])) {
        $visitor_id = $data['visitor_id'];
        
        // Ensure user_id is an integer or NULL, never an empty string
        $user_id = (!empty($data['user_id'])) ? (int)$data['user_id'] : null;
        $ip_address = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

        // Check if tracked today
        $check_stmt = $pdo->prepare("SELECT id FROM site_visits WHERE visitor_id = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 DAY) LIMIT 1");
        $check_stmt->execute([$visitor_id]);
        
        if (!$check_stmt->fetch()) {
            // INSERT with the user_id column
            $stmt = $pdo->prepare("INSERT INTO site_visits 
                (visitor_id, user_id, ip_address, device, os, platform, latitude, longitude, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())");
            
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

            echo json_encode(["status" => "tracked"]);
        } else {
            echo json_encode(["status" => "skipped"]);
        }
    }
} catch (PDOException $e) {
    // This will replace "{}" with the actual SQL error in your console
    http_response_code(500);
    echo json_encode([
        "error" => "Database Error",
        "details" => $e->getMessage()
    ]);
}