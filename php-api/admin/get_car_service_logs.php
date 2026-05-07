<?php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');
$pdo = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $car_id = $_GET['car_id'] ?? null;

    try {
        $stmt = $pdo->prepare("SELECT * FROM car_services WHERE car_id = ? ORDER BY service_date DESC");
        $stmt->execute([$car_id]);
        $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["success" => true, "logs" => $logs]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}