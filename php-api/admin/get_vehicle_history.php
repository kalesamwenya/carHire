<?php
// File: admin/get_vehicle_history.php
require_once '../config/origin.php';
require_once '../config/config.php';
header('Content-Type: application/json');

$car_id = $_GET['car_id'] ?? null;

if (!$car_id) {
    echo json_encode(["success" => false, "message" => "Car ID required"]);
    exit;
}

try {
    $pdo = getDB();
    // Fetch coordinates from the last 24 hours
    $stmt = $pdo->prepare("
        SELECT latitude, longitude, recorded_at 
        FROM vehicle_history 
        WHERE car_id = ? AND recorded_at >= NOW() - INTERVAL 1 DAY
        ORDER BY recorded_at ASC
    ");
    $stmt->execute([$car_id]);
    $history = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "history" => $history]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}