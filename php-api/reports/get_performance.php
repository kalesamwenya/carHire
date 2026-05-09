<?php
require_once '../config/origin.php';
require_once '../config/config.php';

try {
    $pdo = getDB();

    $revenueData = [];
    $labels = [];

    $currentWeekTotal = 0;
    $lastWeekTotal = 0;

    // 1. CURRENT WEEK (with JOIN FIX)
    for ($i = 6; $i >= 0; $i--) {
        $date = date('Y-m-d', strtotime("-$i days"));
        $labels[] = date('D', strtotime($date));

        $stmt = $pdo->prepare("
            SELECT COALESCE(SUM(p.amount_paid),0) as total
            FROM payments p
            LEFT JOIN bookings b ON p.booking_id = b.id
            WHERE DATE(COALESCE(p.paid_at, b.created_at)) = ?
        ");
        $stmt->execute([$date]);

        $val = (float)$stmt->fetchColumn();
        $revenueData[] = $val;
        $currentWeekTotal += $val;
    }

    // 2. PREVIOUS WEEK
    $stmt = $pdo->prepare("
        SELECT COALESCE(SUM(p.amount_paid),0)
        FROM payments p
        LEFT JOIN bookings b ON p.booking_id = b.id
        WHERE DATE(COALESCE(p.paid_at, b.created_at))
        BETWEEN DATE_SUB(CURDATE(), INTERVAL 13 DAY)
        AND DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    ");
    $stmt->execute();
    $lastWeekTotal = (float)$stmt->fetchColumn();

    $growth = ($lastWeekTotal > 0)
        ? round((($currentWeekTotal - $lastWeekTotal) / $lastWeekTotal) * 100)
        : 0;

    // 3. BOOKINGS
    $totalBookings = (int)$pdo->query("SELECT COUNT(*) FROM bookings")->fetchColumn();

    // 4. FLEET
    $totalCars = (int)$pdo->query("SELECT COUNT(*) FROM cars")->fetchColumn();
    $rentedCars = (int)$pdo->query("SELECT COUNT(*) FROM cars WHERE available = 0")->fetchColumn();

    $utilization = ($totalCars > 0)
        ? round(($rentedCars / $totalCars) * 100)
        : 0;

    echo json_encode([
        "success" => true,
        "revenue" => $revenueData,
        "labels" => $labels,
        "growth" => $growth,
        "currentTotal" => $currentWeekTotal,
        "totalBookings" => $totalBookings,
        "utilization" => $utilization,
        "rentedCount" => $rentedCars,
        "totalCars" => $totalCars
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}