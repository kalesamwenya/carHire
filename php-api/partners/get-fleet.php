<?php
// File: get-fleet.php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

// 1. Capture and sanitize the input
$raw_user = $_GET['user_id'] ?? '';

// Check for common "empty" strings sent by JS or missing params
if (
    trim($raw_user) === '' || 
    $raw_user === 'null' || 
    $raw_user === 'undefined' || 
    $raw_user === '0'
) {
    http_response_code(400); // Bad Request
    echo json_encode([
        "success" => false, 
        "message" => "A valid Partner User ID is required to fetch the fleet."
    ]);
    exit;
}

$userId = (int)$raw_user;

try {
    $pdo = getDB();
    
    // Safety: Set group_concat_max_len for long gallery strings (prevents truncated URLs)
    $pdo->exec("SET SESSION group_concat_max_len = 10000;");

    // 2. Prepared Statement for Security
    $sql = "
        SELECT 
            c.id, 
            c.name, 
            c.type,
            c.category,
            c.price_per_day as price, 
            c.plate_number as plate,
            c.featured_image,
            c.mileage,
            CASE 
                WHEN c.available = 1 THEN 'Available'
                ELSE 'Booked'
            END as status,
            (SELECT COUNT(*) FROM bookings b WHERE b.car_id = c.id) as trips,
            GROUP_CONCAT(DISTINCT i.image_url) as gallery_list,
            GROUP_CONCAT(DISTINCT i.id) as gallery_ids
        FROM cars c
        LEFT JOIN car_images i ON c.id = i.car_id
        WHERE c.partner_id = ?
        GROUP BY c.id
        ORDER BY c.created_at DESC
    ";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId]);
    $fleet = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. Process Data for Next.js Consumption
    foreach ($fleet as &$car) {
        // Convert comma-separated strings to clean arrays
        $car['gallery'] = $car['gallery_list'] ? explode(',', $car['gallery_list']) : [];
        $car['gallery_ids'] = $car['gallery_ids'] ? explode(',', $car['gallery_ids']) : [];
        
        // Image priority: Featured -> First Gallery -> Placeholder
        $car['image'] = $car['featured_image'] ?: ($car['gallery'][0] ?? null);
        
        // Ensure numbers are numbers, not strings
        $car['price'] = (float)$car['price'];
        $car['trips'] = (int)$car['trips'];
        $car['mileage'] = (int)$car['mileage'];

        // Cleanup raw DB strings
        unset($car['gallery_list']);
        unset($car['featured_image']);
    }

    echo json_encode([
        "success" => true,
        "count" => count($fleet),
        "data" => $fleet
    ]);

} catch (PDOException $e) {
    http_response_code(500); 
    echo json_encode([
        "success" => false, 
        "message" => "Database Connection Error.",
        "error_details" => $e->getMessage() // Turn off in production
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "System Error: " . $e->getMessage()
    ]);
}