<?php
// File: /api/cars/availability-check.php
require_once '../config/origin.php';
require_once '../config/config.php';
header('Content-Type: application/json');

$pickup = $_GET['pickup'] ?? null;
$dropoff = $_GET['dropoff'] ?? null;
$location = $_GET['location'] ?? ''; 

if (!$pickup || !$dropoff) {
    echo json_encode(["success" => false, "message" => "Dates are required"]);
    exit;
}

// Calculate the number of days selected by the user
$date1 = new DateTime($pickup);
$date2 = new DateTime($dropoff);
$interval = $date1->diff($date2);
$days_selected = $interval->days;

// In case the times result in 0 (e.g., same day booking), treat as 1 or 0 based on your policy
if ($days_selected == 0) $days_selected = 1; 

try {
    $pdo = getDB();

    // SQL Logic Updated to include min_booking_days
    $stmt = $pdo->prepare("
        SELECT 
            c.id, 
            c.name, 
            c.price_per_day AS price, 
            c.min_booking_days,
            c.transmission, 
            c.fuel, 
            c.seats, 
            c.type,
            c.featured_image,
            c.description,
            (SELECT b.return_date 
             FROM bookings b 
             WHERE b.car_id = c.id 
             AND (? <= b.return_date AND ? >= b.pickup_date)
             AND b.status != 'Cancelled'
             LIMIT 1) as conflict_end_date
        FROM cars c
        WHERE c.available = 1
    ");

    $stmt->execute([$pickup, $dropoff]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $formattedResults = [];
    foreach ($results as $car) {
        $min_days = (int)$car['min_booking_days'];
        
        // Check if dates overlap AND if the duration meets the car's requirement
        $is_conflicted = $car['conflict_end_date'] !== null;
        $meets_min_days = ($days_selected >= $min_days);

        $formattedResults[] = [
            "id" => $car['id'],
            "name" => $car['name'],
            "price" => (float)$car['price'],
            "min_days_required" => $min_days,
            "transmission" => $car['transmission'],
            "fuel" => $car['fuel'],
            "seats" => (int)$car['seats'],
            "image" => $car['featured_image'] ?: '/images/placeholder.png',
            "description" => $car['description'],
            "is_available" => (!$is_conflicted && $meets_min_days),
            "available_after" => $car['conflict_end_date'],
            "min_days_error" => !$meets_min_days // Helper flag for the frontend UI
        ];
    }

    echo json_encode([
        "success" => true,
        "days_selected" => $days_selected,
        "data" => $formattedResults
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error"]);
}