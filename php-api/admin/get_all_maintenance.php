<?php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');
$pdo = getDB();

try {
    // Fetch all logs joined with car names
    $sql = "SELECT s.*, c.name as car_name, c.plate_number 
            FROM car_services s 
            JOIN cars c ON s.car_id = c.id 
            ORDER BY s.service_date DESC";
    $stmt = $pdo->query($sql);
    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Fetch overdue vehicles (Cars with last service > 180 days ago OR no service at all)
    $overdueSql = "
        SELECT c.id, c.name, c.plate_number, MAX(s.service_date) as last_service
        FROM cars c
        LEFT JOIN car_services s ON c.id = s.car_id
        GROUP BY c.id
        HAVING last_service IS NULL OR last_service < DATE_SUB(NOW(), INTERVAL 180 DAY)
    ";
    $overdueStmt = $pdo->query($overdueSql);
    $overdueCars = $overdueStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "logs" => $logs,
        "overdue_count" => count($overdueCars),
        "overdue_list" => $overdueCars
    ]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}