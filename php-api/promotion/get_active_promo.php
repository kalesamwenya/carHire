<?php
// FILE: /promotion/get_active_promo.php
require_once '../config/origin.php'; 
require_once '../config/config.php';

// Set JSON header for Axios compatibility
header('Content-Type: application/json');

try {
    $pdo = getDB();
    $currentDate = date('Y-m-d H:i:s');

    /**
     * 1. ADVANCED FETCH
     * We select the most recent promotion that is:
     * - Manually marked as active
     * - Not yet expired
     * - Within its usage limit (if one exists)
     */
    $stmt = $pdo->prepare("
        SELECT 
            code, 
            discount_percent, 
            min_spend,
            description,
            expiry_date
        FROM promotions 
        WHERE is_active = 1 
        AND (expiry_date IS NULL OR expiry_date >= ?)
        AND (usage_limit IS NULL OR current_usage < usage_limit)
        ORDER BY created_at DESC 
        LIMIT 1
    ");
    
    // Using current date to filter out expired codes automatically
    $stmt->execute([$currentDate]);
    $promo = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($promo) {
        /**
         * 2. FORMAT DATA FOR FRONTEND
         * Explicitly casting types ensures JavaScript receives numbers, not strings.
         */
        echo json_encode([
            "success" => true, 
            "promo" => [
                "code"     => (string)$promo['code'],
                "discount" => (int)$promo['discount_percent'],
                "minSpend" => (float)$promo['min_spend'],
                "headline" => $promo['description'] ?: "Special Drive Offer",
                "expires"  => $promo['expiry_date']
            ]
        ]);
    } else {
        // HTTP 200 but success false is cleaner for the PromoBanner component to handle
        echo json_encode([
            "success" => false, 
            "message" => "No active promotions found."
        ]);
    }
} catch (Exception $e) {
    // Log the actual error for debugging CityDrive
    error_log("Promo Fetch Error: " . $e->getMessage());
    
    // Return a 500 error so Axios triggers the .catch() block
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "error"   => "Internal server error"
    ]);
}