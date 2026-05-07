<?php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');
$pdo = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['car_id']) || empty($data['service_type']) || empty($data['cost'])) {
        echo json_encode(["success" => false, "message" => "Required fields missing"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO car_services (car_id, service_date, service_type, cost, mileage_at_service, notes) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $data['car_id'],
            $data['service_date'],
            $data['service_type'],
            $data['cost'],
            $data['mileage'],
            $data['notes']
        ]);

        echo json_encode(["success" => true, "message" => "Log added successfully"]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}