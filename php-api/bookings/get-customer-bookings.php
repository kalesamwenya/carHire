<?php
// File: api/bookings/get-customer-bookings.php
require_once '../../config/origin.php';
require_once '../../config/config.php';

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
                b.id, b.start_date, b.end_date, b.total_price, b.status, b.created_at,
                v.make_model, v.main_image,
                pa.business_name as partner_name,
                pa.phone as partner_phone
            FROM bookings b
            JOIN vehicles v ON b.vehicle_id = v.id
            JOIN partner_about pa ON v.partner_id = pa.user_id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        ");
        
        $stmt->execute([$userId]);
        $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "data" => $bookings ?: []
        ]);

    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}