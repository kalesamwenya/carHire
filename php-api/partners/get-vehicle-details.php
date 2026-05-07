<?php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

$vehicleId = $_GET['vehicle_id'] ?? null;
$raw_user  = $_GET['user_id'] ?? '';
// Handle Admin (null) vs Partner (ID)
$userId = (trim($raw_user) === '' || $raw_user === 'null' || $raw_user === '0') ? null : (int)$raw_user;

$pdo = getDB();

try {
    // 1. Ownership & Existence Check
    $check = $pdo->prepare("SELECT id, partner_id FROM cars WHERE id = ?");
    $check->execute([$vehicleId]);
    $car = $check->fetch(PDO::FETCH_ASSOC);

    if (!$car) {
        echo json_encode(["success" => false, "message" => "Vehicle not found."]);
        exit;
    }

    // Allow access if user is Admin (partner_id is null) OR if user matches partner_id
    $isOwner = ($car['partner_id'] == $userId);
    $isAdminFleet = ($car['partner_id'] === null && $userId === null);

    if (!$isOwner && !$isAdminFleet) {
        echo json_encode([
            "success" => false, 
            "message" => "Unauthorized access to this vehicle record."
        ]);
        exit;
    }

    // 2. Fetch Full Details with Revenue and Gallery IDs
    $stmt = $pdo->prepare("
        SELECT c.*, 
        COALESCE(SUM(b.total_price), 0) as total_revenue,
        COUNT(b.booking_id) as total_bookings,
        GROUP_CONCAT(i.image_url) as gallery_urls,
        GROUP_CONCAT(i.id) as gallery_ids
        FROM cars c
        LEFT JOIN bookings b ON c.id = b.car_id
        LEFT JOIN car_images i ON c.id = i.car_id
        WHERE c.id = ?
        GROUP BY c.id
    ");
    $stmt->execute([$vehicleId]);
    $details = $stmt->fetch(PDO::FETCH_ASSOC);

    // 3. Clean up the response for React
    // Convert GROUP_CONCAT strings into clean arrays
    $details['gallery'] = [];
    if (!empty($details['gallery_urls'])) {
        $urls = explode(',', $details['gallery_urls']);
        $ids = explode(',', $details['gallery_ids']);
        
        foreach ($urls as $index => $url) {
            $details['gallery'][] = [
                'id' => $ids[$index],
                'url' => $url
            ];
        }
    }

    // Ensure numeric types are correct
    $details['total_revenue'] = (float)$details['total_revenue'];
    $details['total_bookings'] = (int)$details['total_bookings'];
    
    // Remove raw concat columns
    unset($details['gallery_urls'], $details['gallery_ids'], $details['image_url']);

    echo json_encode([
        "success" => true, 
        "data" => [
            "info" => $details, 
            "history" => [] // You can populate this with a separate bookings query later
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database Error: " . $e->getMessage()]);
}