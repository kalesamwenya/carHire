<?php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

// Get Axios JSON body
$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['code']) || !isset($data['discount'])) {
    http_response_code(400);
    exit(json_encode(["success" => false, "message" => "Code and Discount are required."]));
}

try {
    $pdo = getDB();

    $code = strtoupper(trim(filter_var($data['code'], FILTER_SANITIZE_STRING)));
    $discount = (int)$data['discount'];
    $min_spend = (float)($data['min_spend'] ?? 0);
    $expiry = !empty($data['expiry_date']) ? $data['expiry_date'] : null;

    // Prevent duplicate codes
    $check = $pdo->prepare("SELECT id FROM promotions WHERE code = ?");
    $check->execute([$code]);
    if ($check->fetch()) {
        http_response_code(409); // Conflict
        exit(json_encode(["success" => false, "message" => "Promotion code '$code' already exists."]));
    }

    $stmt = $pdo->prepare("
        INSERT INTO promotions (code, discount_percent, min_spend, expiry_date, is_active) 
        VALUES (?, ?, ?, ?, 0)
    ");
    
    $stmt->execute([$code, $discount, $min_spend, $expiry]);

    echo json_encode(["success" => true, "message" => "Campaign '$code' created successfully."]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}