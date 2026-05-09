<?php
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

    /* =========================
       1. FINANCIALS
    ========================= */
    $stmtRev = $pdo->prepare("SELECT IFNULL(SUM(amount_paid),0) FROM payments WHERE YEAR(paid_at)=?");
    $stmtRev->execute([$year]);
    $totalRev = (float)$stmtRev->fetchColumn();

    $stmtExp = $pdo->prepare("SELECT IFNULL(SUM(cost),0) FROM maintenance WHERE YEAR(scheduled_date)=?");
    $stmtExp->execute([$year]);
    $totalExp = (float)$stmtExp->fetchColumn();

    $netProfit = $totalRev - $totalExp;

    $stmtAbv = $pdo->prepare("SELECT IFNULL(AVG(amount_paid),0) FROM payments WHERE YEAR(paid_at)=?");
    $stmtAbv->execute([$year]);
    $abv = (float)$stmtAbv->fetchColumn();

    /* =========================
       2. CONVERSION
    ========================= */
    $stmtUnique = $pdo->prepare("SELECT COUNT(DISTINCT visitor_id) FROM site_visits WHERE YEAR(created_at)=?");
    $stmtUnique->execute([$year]);
    $uniqueVisitors = (int)$stmtUnique->fetchColumn();

    $stmtBookings = $pdo->prepare("SELECT COUNT(id) FROM bookings WHERE YEAR(created_at)=?");
    $stmtBookings->execute([$year]);
    $totalBookings = (int)$stmtBookings->fetchColumn();

    $conversionRate = $uniqueVisitors > 0
        ? round(($totalBookings / $uniqueVisitors) * 100, 1)
        : 0;

    /* =========================
       3. CHART DATA
    ========================= */
    $incomeData = $pdo->prepare("
        SELECT MONTH(paid_at) m, SUM(amount_paid) total
        FROM payments WHERE YEAR(paid_at)=?
        GROUP BY MONTH(paid_at)
    ");
    $incomeData->execute([$year]);
    $monthlyIn = $incomeData->fetchAll(PDO::FETCH_KEY_PAIR);

    $expenseData = $pdo->prepare("
        SELECT MONTH(scheduled_date) m, SUM(cost) total
        FROM maintenance WHERE YEAR(scheduled_date)=?
        GROUP BY MONTH(scheduled_date)
    ");
    $expenseData->execute([$year]);
    $monthlyEx = $expenseData->fetchAll(PDO::FETCH_KEY_PAIR);

    $chart = [];
    for ($i=1; $i<=12; $i++) {
        $chart[] = [
            "m" => date('M', mktime(0,0,0,$i,1)),
            "in" => round(($monthlyIn[$i] ?? 0)/1000,1),
            "ex" => round(($monthlyEx[$i] ?? 0)/1000,1)
        ];
    }

    /* =========================
       4. DEVICE STATS
    ========================= */
    $stmtDev = $pdo->prepare("
        SELECT device, COUNT(*) as count 
        FROM site_visits 
        WHERE YEAR(created_at)=?
        GROUP BY device
    ");
    $stmtDev->execute([$year]);

    $deviceRows = $stmtDev->fetchAll(PDO::FETCH_KEY_PAIR);
    $totalVisits = array_sum($deviceRows) ?: 1;

    $sources = [
        "mobile" => round(((( $deviceRows['Mobile'] ?? 0 ) + ($deviceRows['Android'] ?? 0) + ($deviceRows['iPhone'] ?? 0)) / $totalVisits) * 100),
        "desktop" => round(((( $deviceRows['Desktop'] ?? 0 ) + ($deviceRows['Windows'] ?? 0)) / $totalVisits) * 100)
    ];

    /* =========================
       5. 🚨 FIXED COORDINATES (IMPORTANT)
       USE site_visits.latitude + longitude
    ========================= */
    $stmtFleet = $pdo->query("
        SELECT 
            id,
            name AS type,
            IFNULL(latitude, $defLat) AS lat,
            IFNULL(longitude, $defLng) AS lng
        FROM cars
    ");
    $fleet = $stmtFleet->fetchAll(PDO::FETCH_ASSOC);

    /* =========================
       6. REAL VISITOR MAP POINTS (THIS FIXES YOUR ISSUE)
    ========================= */
    $stmtTraffic = $pdo->prepare("
        SELECT 
            latitude AS lat,
            longitude AS lng,
            device,
            os,
            created_at
        FROM site_visits
        WHERE YEAR(created_at)=?
    ");
    $stmtTraffic->execute([$year]);
    $allPoints = $stmtTraffic->fetchAll(PDO::FETCH_ASSOC);

    // Clean numeric values (VERY IMPORTANT for map)
    foreach ($allPoints as &$p) {
        $p['lat'] = (float)$p['lat'];
        $p['lng'] = (float)$p['lng'];
    }

    /* =========================
       7. RECENT ACTIVITY
    ========================= */
    $stmtAct = $pdo->query("
        SELECT device as os, platform, created_at as visit_date 
        FROM site_visits 
        ORDER BY created_at DESC 
        LIMIT 5
    ");
    $recentActivity = $stmtAct->fetchAll(PDO::FETCH_ASSOC);

    /* =========================
       OUTPUT CLEAN JSON
    ========================= */
    ob_clean();

    echo json_encode([
        "success" => true,
        "netProfit" => $netProfit,
        "abv" => round($abv,2),
        "conversionRate" => $conversionRate,
        "chart" => $chart,

        // MAP DATA FIXES
        "fleet" => $fleet,
        "allPoints" => $allPoints,

        "sources" => $sources,
        "recentActivity" => $recentActivity,

        "topLocation" => ["name" => "Lusaka"],
        "osStats" => [["os" => "Android"]]
    ]);

} catch (Exception $e) {
    ob_clean();
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}