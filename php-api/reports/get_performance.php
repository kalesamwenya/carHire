<?php
require_once '../config/origin.php';
require_once '../config/config.php';

try {
    $pdo = getDB();

    $revenueData = [];
    $labels = [];
    $currentWeekTotal = 0;
    $lastWeekTotal = 0;

    // 1. Current 7 Days Revenue
    for ($i = 6; $i >= 0; $i--) {
        $targetDate = date('Y-m-d', strtotime("-$i days"));
        $labels[] = date('D', strtotime($targetDate));
        
        $stmt = $pdo->prepare("
            SELECT SUM(p.amount_paid) as daily_total 
            FROM payments p
            JOIN bookings b ON p.booking_id = b.id
            WHERE DATE(COALESCE(p.paid_at, b.created_at)) = ?
        ");
        $stmt->execute([$targetDate]);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        $val = (float)($res['daily_total'] ?? 0);
        $revenueData[] = $val;
        $currentWeekTotal += $val;
    }

    // 2. Previous 7 Days Revenue (for growth calculation)
    $prevStart = date('Y-m-d', strtotime("-13 days"));
    $prevEnd = date('Y-m-d', strtotime("-7 days"));
    $stmtPrev = $pdo->prepare("
        SELECT SUM(p.amount_paid) FROM payments p
        JOIN bookings b ON p.booking_id = b.id
        WHERE DATE(COALESCE(p.paid_at, b.created_at)) BETWEEN ? AND ?
    ");
    $stmtPrev->execute([$prevStart, $prevEnd]);
    $lastWeekTotal = (float)$stmtPrev->fetchColumn();

    // Calculate Growth %
    $growth = ($lastWeekTotal > 0) ? round((($currentWeekTotal - $lastWeekTotal) / $lastWeekTotal) * 100) : 100;

    // 3. Totals & Fleet
    $totalBookings = $pdo->query("SELECT COUNT(booking_id) FROM bookings")->fetchColumn();
    $totalCars = $pdo->query("SELECT COUNT(*) FROM cars")->fetchColumn();
    $rentedCars = $pdo->query("SELECT COUNT(*) FROM cars WHERE available = '0'")->fetchColumn();
    $utilization = ($totalCars > 0) ? round(($rentedCars / $totalCars) * 100) : 0;

    echo json_encode([
        "success" => true,
        "revenue" => $revenueData,
        "labels" => $labels,
        "growth" => $growth,
        "currentTotal" => $currentWeekTotal,
        "totalBookings" => (int)$totalBookings,
        "utilization" => (int)$utilization,
        "rentedCount" => (int)$rentedCars,
        "totalCars" => (int)$totalCars
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}