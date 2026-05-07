<?php
/**
 * FILE: api/bookings/get-booking.php
 * Updated to match Emit Photography's DB Schema and fix CORS Network Errors.
 */

// 1. FIX NETWORK ERROR (CORS HEADERS)
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle pre-flight browser checks
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

require_once '../config/config.php';

$id = $_GET['id'] ?? null;

if (!$id || $id === 'undefined') {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Valid Booking ID required"]);
    exit;
}

try {
    $pdo = getDB();
    
    // 2. UPDATED SQL (Matches your provided schema)
    $stmt = $pdo->prepare("
        SELECT 
            b.*, 
            c.name as car_name, c.image_url, c.transmission, c.fuel, c.color, c.seats,
            p.payment_method, p.transaction_code, p.amount_paid, p.paid_at as payment_date
        FROM bookings b 
        JOIN cars c ON b.car_id = c.id 
        LEFT JOIN payments p ON b.booking_id = p.booking_id
        WHERE b.booking_id = ?
    ");
    
    $stmt->execute([$id]);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($booking) {
        // Return data as clean JSON
        echo json_encode($booking);
    } else {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Booking record $id not found"]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error occurred"]);
}