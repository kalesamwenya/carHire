<?php
// File: /cars/get-cars.php
require_once '../config/origin.php';
require_once '../config/config.php';
header('Content-Type: application/json');

try {
    $pdo = getDB();
    
    // Updated query to include min_booking_days
    $stmt = $pdo->prepare("
        SELECT 
            c.id, 
            c.name, 
            c.category,
            c.price_per_day AS price, 
            c.min_booking_days,
            c.transmission, 
            c.fuel, 
            c.seats, 
            c.type,
            c.available,
            c.featured_image
        FROM cars c
        ORDER BY c.id DESC
    ");
    
    $stmt->execute();
    $cars = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format data types for the React frontend filters
    foreach ($cars as &$car) {
        $car['price'] = (float)$car['price'];
        $car['seats'] = (int)$car['seats'];
        
        // Ensure min_booking_days is an integer for logic checks
        $car['min_booking_days'] = (int)($car['min_booking_days'] ?? 1);
        
        // available is returned as a boolean for easier React logic
        $car['available'] = (int)$car['available'] === 1;
        
        // Provide the 'image' key that CarCard.jsx expects
        $car['image'] = $car['featured_image'] ?: '/images/placeholder-car.png';
        
        // Remove DB-specific columns not needed by the public frontend
        unset($car['featured_image']);
    }

    // Return the raw array
    echo json_encode($cars);

} catch (PDOException $e) {
    http_response_code(500);
    error_log("Fleet Fetch Error: " . $e->getMessage());
    echo json_encode([]);
}