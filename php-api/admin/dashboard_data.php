<?php
// File: admin/dashboard_data.php
require_once '../config/origin.php';
require_once '../config/config.php';

$pdo = getDB();

try {
    // 1. Fetch Fleet Stats
    $cars = $pdo->query("SELECT id, name, plate_number, available FROM cars")->fetchAll(PDO::FETCH_ASSOC);
    
    // 2. Fetch Detailed Booking Data (JOINED for your design)
    // We join the 'cars' table to get the vehicle name instead of just the ID
    $bookingsQuery = "
        SELECT 
            b.id, 
            b.customer_name as user, 
            c.name as car, 
            b.pickup_date, 
            b.return_date, 
            b.total_price as total, 
            b.status 
        FROM bookings b
        LEFT JOIN cars c ON b.car_id = c.id
        ORDER BY b.pickup_date DESC
    ";
    $bookings = $pdo->query($bookingsQuery)->fetchAll(PDO::FETCH_ASSOC);
    
    // 3. Fetch Reviews
    $reviews = $pdo->query("SELECT id, rating, comment FROM reviews")->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data" => [
            "cars" => $cars,
            "bookings" => $bookings,
            "reviews" => $reviews
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}