<?php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$promo_id = (int)($data['id'] ?? 0);

if (!$promo_id) {
    http_response_code(400);
    exit(json_encode(["success" => false, "message" => "Invalid ID."]));
}

try {
    $pdo = getDB();

    // 1. Get current status
    $stmt = $pdo->prepare("SELECT is_active FROM promotions WHERE id = ?");
    $stmt->execute([$promo_id]);
    $current = $stmt->fetch();

    if (!$current) {
        throw new Exception("Promotion not found.");
    }

    $new_status = $current['is_active'] ? 0 : 1;

    // 2. If we are activating this one, we might want to deactivate others (Optional)
    /*
    if ($new_status == 1) {
        $pdo->query("UPDATE promotions SET is_active = 0");
    }
    */

    // 3. Update the targeted promo
    $update = $pdo->prepare("UPDATE promotions SET is_active = ? WHERE id = ?");
    $update->execute([$new_status, $promo_id]);

    echo json_encode([
        "success" => true, 
        "message" => "Status updated to " . ($new_status ? 'Active' : 'Inactive')
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}