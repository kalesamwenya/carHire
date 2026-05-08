<?php
require_once '../config/origin.php';
require_once '../config/config.php';
$pdo = getDB();

header('Content-Type: application/json');

try {
    // We aggregate payments (SUM) and use GROUP BY to ensure one row per booking
    $sql = "SELECT 
                b.id AS main_id,
                b.booking_id AS display_id,
                b.customer_name,
                b.total_price AS booking_total,
                b.created_at,
                -- Aggregate all payments for this booking
                COALESCE(SUM(p.amount_paid), 0) AS amount_paid,
                -- Determine status based on the sum of payments vs total price
                CASE 
                    WHEN COALESCE(SUM(p.amount_paid), 0) >= b.total_price THEN 'Verified'
                    WHEN COALESCE(SUM(p.amount_paid), 0) > 0 THEN 'Partial'
                    ELSE 'Pending'
                END AS payment_status,
                c.name AS car_name,
                -- Get the latest payment date if available, otherwise booking date
                COALESCE(MAX(p.paid_at), b.created_at) AS active_date
            FROM bookings b
            LEFT JOIN payments p ON b.id = p.booking_id
            LEFT JOIN cars c ON b.car_id = c.id
            GROUP BY b.id, b.booking_id, b.customer_name, b.total_price, b.created_at, c.name
            ORDER BY b.created_at DESC";

    $stmt = $pdo->query($sql);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Convert numeric strings to floats for cleaner frontend JS handling
    foreach ($data as &$row) {
        $row['booking_total'] = (float)$row['booking_total'];
        $row['amount_paid'] = (float)$row['amount_paid'];
    }

    echo json_encode([
        "status" => "success", 
        "data" => $data,
        "meta" => [
            "currency" => "ZMW",
            "server_time" => date('Y-m-d H:i:s')
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error", 
        "message" => $e->getMessage()
    ]);
}