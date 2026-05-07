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
    // 1. Get Monthly Revenue for last 6 months
    $revenueStmt = $pdo->prepare("
        SELECT 
            DATE_FORMAT(pickup_date, '%b') as month,
            SUM(total_price) as total
        FROM bookings b
        JOIN cars c ON b.car_id = c.id
        WHERE c.partner_id = ? AND b.status != 'Cancelled'
        AND b.pickup_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY MONTH(b.pickup_date)
        ORDER BY b.pickup_date ASC
    ");
    $revenueStmt->execute([$userId]);
    $monthlyRevenue = $revenueStmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Get Vehicle Utilization
    // Logic: (Total Booked Days / 30 Days) * 100
    $utilStmt = $pdo->prepare("
        SELECT 
            c.name,
            COALESCE(SUM(DATEDIFF(b.return_date, b.pickup_date)), 0) as booked_days
        FROM cars c
        LEFT JOIN bookings b ON c.id = b.car_id AND b.status = 'Completed'
        WHERE c.partner_id = ?
        GROUP BY c.id
    ");
    $utilStmt->execute([$userId]);
    $utilization = $utilStmt->fetchAll(PDO::FETCH_ASSOC);

    // Format utilization for frontend
    foreach ($utilization as &$v) {
        $percent = ($v['booked_days'] / 30) * 100;
        $v['percentage'] = min(round($percent), 100); // Cap at 100%
    }

    echo json_encode([
        "success" => true,
        "revenue" => $monthlyRevenue,
        "utilization" => $utilization
    ]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}