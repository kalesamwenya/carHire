<?php
require_once '../config/origin.php';
require_once '../config/config.php';
$pdo = getDB();

try {
    // We join bookings (b), payments (p), and cars (c)
    $sql = "SELECT 
            b.booking_id AS main_id,
            b.booking_id AS display_id,
            b.customer_name,
            b.total_price AS booking_total,
            -- If paid_at is null, SQL will return created_at instead
            COALESCE(p.paid_at, b.created_at) AS active_date,
            p.amount_paid,
            p.payment_status,
            c.name AS car_name
        FROM bookings b
        LEFT JOIN payments p ON b.id = p.booking_id
        LEFT JOIN cars c ON b.car_id = c.id
        ORDER BY b.created_at DESC";

    $stmt = $pdo->query($sql);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "data" => $data]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}