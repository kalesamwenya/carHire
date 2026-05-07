<?php
require_once '../config/origin.php'; // Handle CORS
require_once '../config/config.php';

header('Content-Type: application/json');
$pdo = getDB();

try {
    // Fetch Cars
    $cars = $pdo->query("SELECT * FROM cars")->fetchAll(PDO::FETCH_ASSOC);
    
    // Fetch Bookings
    $bookings = $pdo->query("SELECT * FROM bookings")->fetchAll(PDO::FETCH_ASSOC);
    
    // Fetch Users (excluding passwords)
    $users = $pdo->query("SELECT id, name, role FROM users")->fetchAll(PDO::FETCH_ASSOC);
    
    // Fetch Reviews
    $reviews = $pdo->query("SELECT * FROM reviews ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "cars" => $cars,
        "bookings" => $bookings,
        "users" => $users,
        "reviews" => $reviews
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}