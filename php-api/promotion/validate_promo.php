<?php
// File: /promotion/validate_promo.php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$input_code = strtoupper(trim($data['code'] ?? ''));
$cart_total = (float)($data['total'] ?? 0);

try {
    $pdo = getDB();
    $currentDate = date('Y-m-d H:i:s');

    // 1. Precise Lookup
    $stmt = $pdo->prepare("
        SELECT * FROM promotions 
        WHERE code = ? 
        AND is_active = 1 
        AND (expiry_date IS NULL OR expiry_date >= ?)
        LIMIT 1
    ");
    $stmt->execute([$input_code, $currentDate]);
    $promo = $stmt->fetch(PDO::FETCH_ASSOC);

    // 2. Validation Chain
    if (!$promo) {
        throw new Exception("Invalid or expired promotion code.");
    }

    // Check Usage Limits
    if ($promo['usage_limit'] !== null && $promo['current_usage'] >= $promo['usage_limit']) {
        throw new Exception("This promotion code has reached its maximum use limit.");
    }

    // Check Minimum Spend
    if ($cart_total < (float)$promo['min_spend']) {
        throw new Exception("Minimum spend of K" . number_format($promo['min_spend'], 2) . " required for this code.");
    }

    // 3. Financial Calculations
    // Rounding to 2 decimal places ensures no "weird" floating point numbers in your currency
    $discount_percent = (int)$promo['discount_percent'];
    $discount_amount = round($cart_total * ($discount_percent / 100), 2);
    $final_total = $cart_total - $discount_amount;

    // 4. Structured Response
    echo json_encode([
        "success" => true,
        "message" => "Promo applied: " . $discount_percent . "% off!",
        "data" => [
            "code" => $promo['code'],
            "discount_percent" => $discount_percent,
            "savings" => $discount_amount,
            "original_total" => $cart_total,
            "new_total" => $final_total
        ]
    ]);

} catch (Exception $e) {
    // We keep 200 OK but send success: false so the frontend can display the message to the user
    echo json_encode([
        "success" => false, 
        "message" => $e->getMessage()
    ]);
}