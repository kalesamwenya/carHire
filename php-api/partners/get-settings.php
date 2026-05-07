<?php
// File: partners/get-settings.php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = $_GET['user_id'] ?? null;

    if (!$userId) {
        echo json_encode(["success" => false, "message" => "User ID required"]);
        exit;
    }

    $pdo = getDB();

    try {
        $stmt = $pdo->prepare("
            SELECT 
                u.image as avatar_url,
                pa.business_name,
                pa.phone,
                pa.bio,
                pa.tax_id,
                pa.id_number,
                pa.address_line1,
                pa.city,
                pa.bank_name,
                pa.account_number,
                pa.kyc_status
            FROM users u
            LEFT JOIN partner_about pa ON u.id = pa.user_id
            WHERE u.id = ?
        ");
        
        $stmt->execute([$userId]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "data" => $data ?: []
        ]);

    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}