<?php
// File: api/partners/get-vehicle-details.php
require_once '../config/origin.php';
require_once '../config/config.php';
header('Content-Type: application/json');

$vehicle_id = $_GET['carId'] ?? null;

if (!$vehicle_id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing vehicle ID"]);
    exit;
}

try {
    $pdo = getDB();

    // 1. FETCH VEHICLE INFO, STATS, AND AGGREGATED IMAGES
    // Added min_booking_days into the logic via c.*
    $stmt = $pdo->prepare("SELECT 
            c.*, 
            c.price_per_day AS price,
            (SELECT COUNT(*) FROM bookings WHERE car_id = c.id AND status = 'Completed') as total_bookings,
            (SELECT SUM(total_price) FROM bookings WHERE car_id = c.id AND status = 'Completed') as total_revenue,
            GROUP_CONCAT(i.id ORDER BY i.is_featured DESC, i.id ASC) as image_ids,
            GROUP_CONCAT(i.image_url ORDER BY i.is_featured DESC, i.id ASC) as image_urls
            FROM cars c 
            LEFT JOIN car_images i ON c.id = i.car_id
            WHERE c.id = ? 
            GROUP BY c.id 
            LIMIT 1");
    
    $stmt->execute([$vehicle_id]);
    $car = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$car) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Vehicle not found"]);
        exit;
    }

    // 2. FORMAT IMAGE LIST FOR REACT
    $car['image_list'] = [];
    if ($car['image_urls']) {
        $urls = explode(',', $car['image_urls']);
        $ids = explode(',', $car['image_ids']);
        foreach ($urls as $index => $url) {
            $car['image_list'][] = [
                'id' => (int)$ids[$index],
                'url' => $url,
                'is_featured' => ($url === $car['featured_image'])
            ];
        }
    }

    // Clean up numeric types
    $car['price'] = (float)$car['price'];
    $car['min_booking_days'] = (int)($car['min_booking_days'] ?? 1); // Cast to int
    $car['total_revenue'] = (float)($car['total_revenue'] ?? 0);
    $car['total_bookings'] = (int)$car['total_bookings'];
    $car['seats'] = (int)$car['seats'];
    $car['mileage'] = (int)$car['mileage'];
    
    // Remove temporary concat columns
    unset($car['image_ids'], $car['image_urls']);

    // 3. FETCH BOOKING HISTORY
    $histStmt = $pdo->prepare("SELECT 
            id as booking_id,
            customer_name,
            pickup_date,
            return_date,
            total_price,
            status,
            'Paid' as payment_status 
            FROM bookings 
            WHERE car_id = ? 
            ORDER BY pickup_date DESC");
    $histStmt->execute([$vehicle_id]);
    $history = $histStmt->fetchAll(PDO::FETCH_ASSOC);

    // 4. COMBINE FOR REACT
    echo json_encode([
        "success" => true,
        "data" => [
            "info" => $car,
            "history" => $history
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}