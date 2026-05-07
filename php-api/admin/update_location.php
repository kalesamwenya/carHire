<?php
// File: admin/update_location.php
require_once '../config/origin.php';
require_once '../config/config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$car_id = $data['car_id'] ?? null;
$lat = $data['latitude'] ?? null;
$lng = $data['longitude'] ?? null;
$speed = $data['speed'] ?? 0;

if (!$car_id || !$lat || !$lng) {
    echo json_encode(["success" => false, "message" => "Invalid data"]);
    exit;
}

try {
    $pdo = getDB();
    $pdo->beginTransaction();

    // 1. Update current position in main table
    $updateStmt = $pdo->prepare("UPDATE cars SET latitude = ?, longitude = ?, mileage = ?, updated_at = NOW() WHERE id = ?");
    $updateStmt->execute([$lat, $lng, $speed, $car_id]);

    // 2. Insert into history log
    $historyStmt = $pdo->prepare("INSERT INTO vehicle_history (car_id, latitude, longitude, speed) VALUES (?, ?, ?, ?)");
    $historyStmt->execute([$car_id, $lat, $lng, $speed]);

    $pdo->commit();
    echo json_encode(["success" => true]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}