<?php
// File: bookings/me.php
require_once '../config/origin.php'; 
require_once '../config/config.php'; 

header('Content-Type: application/json');
$pdo = getDB();

$userId = $_GET['user_id'] ?? null; 

if (!$userId) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "User ID required"]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT 
            /* 1. BOOKING DATA */
            b.id as internal_id, 
            b.booking_id, 
            b.reference_code as booking_ref,
            b.pickup_date, 
            b.return_date, 
            b.total_price as quoted_price, 
            b.status as booking_status,
            
            /* 2. CAR DATA */
            c.name as car_name, 
            c.type as car_type,
            c.plate_number,
            c.featured_image,
            c.transmission,
            c.fuel as fuel_type,
            c.seats,
            c.color,

            i.car_id,
            i.image_url,
            
            /* 3. PAYMENT DATA */
            p.transaction_code,
            p.amount_paid,
            p.payment_method,
            p.payment_status,
            p.receipt_path,
            p.paid_at
            
        FROM bookings b
        INNER JOIN cars c ON b.car_id = c.id
        LEFT JOIN payments p ON b.booking_id = p.booking_id
        LEFT JOIN car_images i ON b.id = i.car_id
        WHERE b.user_id = ?
        ORDER BY b.created_at DESC
    ");
    
    $stmt->execute([$userId]);
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($bookings ?: []);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}