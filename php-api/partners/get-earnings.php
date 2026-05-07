<?php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

$userId = $_GET['user_id'] ?? null;
if (!$userId) {
    echo json_encode(["success" => false, "message" => "User ID required"]);
    exit;
}

$pdo = getDB();

try {
    // We use COALESCE to return 0 instead of NULL if a car has no bookings yet
    $stmt = $pdo->prepare("
        SELECT 
            c.id, 
            c.name, 
            c.plate_number as plate,
            (SELECT COUNT(*) FROM bookings WHERE car_id = c.id) as trips,
            (SELECT COALESCE(SUM(total_price), 0) FROM bookings WHERE car_id = c.id AND status != 'Cancelled') as earnings,
            -- Setting expenses to 0 for now as it's not in your cars table
            0 as expenses
        FROM cars c
        WHERE c.partner_id = ? 
        ORDER BY c.created_at DESC
    ");
    
    $stmt->execute([$userId]);
    $fleet = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Final check/format for React
    foreach ($fleet as &$car) {
        $car['trips'] = (int)$car['trips'];
        $car['earnings'] = (float)$car['earnings'];
        $car['expenses'] = (float)$car['expenses'];
    }

    echo json_encode([
        "success" => true,
        "data" => $fleet ?: []
    ]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}