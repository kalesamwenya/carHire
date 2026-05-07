<?php
// File: cars/get-cars-by-ids.php
require_once '../config/origin.php';
require_once '../config/config.php';
header('Content-Type: application/json');

$ids_raw = $_GET['ids'] ?? null;

if (!$ids_raw) {
    http_response_code(400);
    echo json_encode(["message" => "Vehicle IDs are required"]);
    exit;
}

// Convert comma-separated string to array and sanitize
$idArray = array_filter(explode(',', $ids_raw), 'is_numeric');

if (empty($idArray)) {
    echo json_encode([]);
    exit;
}

try {
    $pdo = getDB();
    
    // 1. Create placeholders: ?,?,? based on the number of IDs
    $placeholders = implode(',', array_fill(0, count($idArray), '?'));
    
    // 2. Query joins car_images - Added min_booking_days to the SELECT
    $sql = "SELECT 
            c.id, 
            c.name, 
            c.price_per_day AS price, 
            c.min_booking_days,
            c.transmission, 
            c.fuel, 
            c.seats, 
            c.type, 
            c.category,
            c.available, 
            c.featured_image,
            c.description,
            GROUP_CONCAT(i.image_url) as gallery_list
            FROM cars c
            LEFT JOIN car_images i ON c.id = i.car_id
            WHERE c.id IN ($placeholders)
            GROUP BY c.id";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array_values($idArray));
    $cars = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. Format each car for React
    $formattedCars = array_map(function($car) {
        $car['price'] = (float)$car['price'];
        $car['min_booking_days'] = (int)($car['min_booking_days'] ?? 1);
        $car['available'] = (int)$car['available'] === 1;
        $car['seats'] = (int)$car['seats'];
        
        // Convert the comma-separated gallery into a clean array
        $gallery = $car['gallery_list'] ? explode(',', $car['gallery_list']) : [];
        
        // 'images' is the full array, 'image' is the main thumbnail
        $car['images'] = $gallery;
        $car['image'] = $car['featured_image'] ?: ($gallery[0] ?? null);
        
        // Clean up internal columns
        unset($car['gallery_list'], $car['featured_image']);
        
        return $car;
    }, $cars);

    echo json_encode($formattedCars);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
}