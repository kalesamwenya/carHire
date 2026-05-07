<?php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');
$pdo = getDB();

try {
    // We join car_images to get the gallery and IDs in one go
    // We group by c.id to avoid duplicate rows for the same car
    $stmt = $pdo->prepare("
        SELECT 
            c.*, 
            GROUP_CONCAT(i.image_url ORDER BY i.is_featured DESC, i.id ASC) as gallery_urls,
            GROUP_CONCAT(i.id ORDER BY i.is_featured DESC, i.id ASC) as gallery_ids
        FROM cars c
        LEFT JOIN car_images i ON c.id = i.car_id
        GROUP BY c.id
        ORDER BY c.created_at DESC
    ");
    
    $stmt->execute();
    $cars = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format the data for your React components
    foreach ($cars as &$car) {
        // 1. Convert concatenated strings to clean arrays
        $urls = $car['gallery_urls'] ? explode(',', $car['gallery_urls']) : [];
        $ids = $car['gallery_ids'] ? explode(',', $car['gallery_ids']) : [];
        
        $car['gallery'] = [];
        foreach ($urls as $index => $url) {
            $car['gallery'][] = [
                'id' => (int)$ids[$index],
                'url' => $url
            ];
        }

        // 2. Set the primary image (Featured first, then fallback to gallery[0])
        $car['image'] = $car['featured_image'] ?: ($urls[0] ?? null);

        // 3. Cast numeric types for frontend consistency
        $car['price_per_day'] = (float)$car['price_per_day'];
        $car['seats'] = (int)$car['seats'];
        $car['available'] = (int)$car['available'] === 1;

        // Cleanup raw SQL columns
        unset($car['gallery_urls'], $car['gallery_ids'], $car['image_url']);
    }

    echo json_encode(["success" => true, "cars" => $cars]);
    
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}