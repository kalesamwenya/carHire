<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once '../config/config.php';

$id = $_GET['id'] ?? null;

if (!$id || $id === 'undefined') {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Valid Booking ID required"]);
    exit;
}

try {
    $pdo = getDB();

    $stmt = $pdo->prepare("
    SELECT 
        b.*,
        c.name AS car_name,
        c.featured_image AS image_url,
        c.transmission,
        c.fuel,
        c.color,
        c.seats,

        p.payment_method,
        p.transaction_code,
        p.amount_paid,
        p.paid_at AS payment_date

    FROM bookings b
    LEFT JOIN cars c ON b.car_id = c.id
    LEFT JOIN payments p ON b.booking_id = p.booking_id
    WHERE b.booking_id = ?
    LIMIT 1
");

    $stmt->execute([$id]);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$booking) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Booking not found"
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "data" => $booking
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "SQL Error",
        "debug" => $e->getMessage() // 🔥 temporarily enable for debugging
    ]);
}