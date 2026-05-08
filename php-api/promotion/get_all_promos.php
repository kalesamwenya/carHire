<?php
require_once '../config/origin.php'; // Your CORS headers
require_once '../config/config.php';

header('Content-Type: application/json');

try {
    $pdo = getDB();
    
    // Fetch with explicit ordering
    $stmt = $pdo->query("SELECT * FROM promotions ORDER BY created_at DESC");
    $promos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Cast data types correctly for JavaScript consumption
    foreach ($promos as &$p) {
        $p['id'] = (int)$p['id'];
        $p['discount_percent'] = (int)$p['discount_percent'];
        $p['min_spend'] = (float)$p['min_spend'];
        $p['is_active'] = (bool)$p['is_active'];
        
        // Add a server-side check for expiry
        $p['is_expired'] = ($p['expiry_date'] && $p['expiry_date'] < date('Y-m-d'));
    }

    echo json_encode(["success" => true, "promos" => $promos]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}