<?php
// Prevent accidental errors from corrupting JSON output
error_reporting(0); 
ob_start();

require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

try {
    $pdo = getDB();
    $year = isset($_GET['year']) ? (int)$_GET['year'] : 2026;

    $defLat = -15.4167;
    $defLng = 28.2833;

    // 1. Financials (Coalesce to 0 to avoid nulls)
    $stmtRev = $pdo->prepare("SELECT IFNULL(SUM(amount_paid), 0) FROM payments WHERE YEAR(paid_at) = ?");
    $stmtRev->execute([$year]);
    $totalRev = (float)$stmtRev->fetchColumn();

    $stmtExp = $pdo->prepare("SELECT IFNULL(SUM(cost), 0) FROM maintenance WHERE YEAR(scheduled_date) = ?");
    $stmtExp->execute([$year]);
    $totalExp = (float)$stmtExp->fetchColumn();
    $netProfit = $totalRev - $totalExp;

    // ABV Calculation
    $stmtAbv = $pdo->prepare("SELECT IFNULL(AVG(amount_paid), 0) FROM payments WHERE YEAR(paid_at) = ?");
    $stmtAbv->execute([$year]);
    $abv = (float)$stmtAbv->fetchColumn();

    // 2. Conversion (FIXED: Added $ to uniqueVisitors)
    $stmtUnique = $pdo->prepare("SELECT COUNT(DISTINCT visitor_id) FROM site_visits WHERE YEAR(visit_date) = ?");
    $stmtUnique->execute([$year]);
    $uniqueVisitors = (int)$stmtUnique->fetchColumn();

    $stmtBookings = $pdo->prepare("SELECT COUNT(id) FROM bookings WHERE YEAR(created_at) = ?");
    $stmtBookings->execute([$year]);
    $totalBookings = (int)$stmtBookings->fetchColumn();
    // Use the variable $uniqueVisitors correctly here
    $conversionRate = ($uniqueVisitors > 0) ? round(($totalBookings / $uniqueVisitors) * 100, 1) : 0;

    // 3. Optimized Monthly Chart Data (Query once, then map)
    $incomeData = $pdo->prepare("SELECT MONTH(paid_at) as m, SUM(amount_paid) as total FROM payments WHERE YEAR(paid_at) = ? GROUP BY MONTH(paid_at)");
    $incomeData->execute([$year]);
    $monthlyIn = $incomeData->fetchAll(PDO::FETCH_KEY_PAIR);

    $expenseData = $pdo->prepare("SELECT MONTH(scheduled_date) as m, SUM(cost) as total FROM maintenance WHERE YEAR(scheduled_date) = ? GROUP BY MONTH(scheduled_date)");
    $expenseData->execute([$year]);
    $monthlyEx = $expenseData->fetchAll(PDO::FETCH_KEY_PAIR);

    $chart = [];
    for ($i = 1; $i <= 12; $i++) {
        $chart[] = [
            "m" => date('M', mktime(0, 0, 0, $i, 1)),
            "in" => round(($monthlyIn[$i] ?? 0) / 1000, 1),
            "ex" => round(($monthlyEx[$i] ?? 0) / 1000, 1)
        ];
    }

    // 4. Device Stats (Added fallback for unknown devices)
    $stmtDev = $pdo->prepare("SELECT device, COUNT(*) as count FROM site_visits WHERE YEAR(visit_date) = ? GROUP BY device");
    $stmtDev->execute([$year]);
    $deviceRows = $stmtDev->fetchAll(PDO::FETCH_KEY_PAIR);
    $totalVisits = array_sum($deviceRows) ?: 1;
    
    $sources = [
        "mobile" => round(((($deviceRows['mobile'] ?? 0) + ($deviceRows['Android'] ?? 0) + ($deviceRows['iPhone'] ?? 0)) / $totalVisits) * 100),
        "desktop" => round(((($deviceRows['desktop'] ?? 0) + ($deviceRows['Windows'] ?? 0)) / $totalVisits) * 100)
    ];

    // 5. Fleet Positions
    $stmtFleet = $pdo->query("SELECT id, name as type, IFNULL(latitude, $defLat) as lat, IFNULL(longitude, $defLng) as lng FROM cars");
    $fleetPositions = $stmtFleet->fetchAll(PDO::FETCH_ASSOC);

    // 6. Recent Activity
    $stmtAct = $pdo->query("SELECT device as os, platform, visit_date FROM site_visits ORDER BY visit_date DESC LIMIT 5");
    $recentActivity = $stmtAct->fetchAll(PDO::FETCH_ASSOC);

    ob_clean(); // Clear buffer to ensure only JSON is sent
    echo json_encode([
        "success" => true,
        "netProfit" => $netProfit,
        "abv" => round($abv, 2),
        "conversionRate" => $conversionRate,
        "chart" => $chart,
        "fleet" => $fleetPositions,
        "sources" => $sources,
        "recentActivity" => $recentActivity,
        "topLocation" => ["name" => "Lusaka"],
        "osStats" => [["os" => "Android"]]
    ]);

} catch (Exception $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database Error: " . $e->getMessage()]);
}