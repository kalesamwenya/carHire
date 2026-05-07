<?php
require_once '../config/origin.php';
require_once '../config/config.php';
header('Content-Type: application/json');

try {
    $pdo = getDB();
    
    // Fetch the single car where is_advertised is true
    // We order by ID DESC as a fallback if multiple are accidentally marked
    $stmt = $pdo->prepare("
        SELECT 
            id, name, price_per_day AS price, 
            featured_image, available
        FROM cars 
        WHERE is_advertised = 1 
        LIMIT 1
    ");
    
    $stmt->execute();
    $car = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($car) {
        // Formatting for your React component
        $car['price'] = (float)$car['price'];
        $car['image'] = $car['featured_image'] ?: '/images/placeholder-car.png';
        
        echo json_encode(['success' => true, 'data' => $car]);
    } else {
        // Fallback: Return the most recent car if none are advertised
        echo json_encode(['success' => false, 'message' => 'No active advert found']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}