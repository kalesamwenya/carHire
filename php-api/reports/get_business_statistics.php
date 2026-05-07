<?php
require_once '../config/origin.php';
require_once '../config/config.php';

try {
    $pdo = getDB();
    $year = isset($_GET['year']) ? (int)$_GET['year'] : date('Y');
    $defLat = -15.4167; // Lusaka Default
    $defLng = 28.2833;

    // 1. FINANCIALS & ABV
    $stmtRev = $pdo->prepare("SELECT SUM(amount_paid) as total, AVG(amount_paid) as abv FROM payments WHERE YEAR(paid_at) = ?");
    $stmtRev->execute([$year]);
    $res = $stmtRev->fetch();
    $totalRev = (float)$res['total'];
    $currentAbv = (float)$res['abv'];

    $stmtExp = $pdo->prepare("SELECT SUM(cost) FROM maintenance WHERE YEAR(scheduled_date) = ?");
    $stmtExp->execute([$year]);
    $totalExp = (float)$stmtExp->fetchColumn();
    $netProfit = $totalRev - $totalExp;

    // 2. GROWTH TREND (Comparison with previous year)
    $stmtPrev = $pdo->prepare("SELECT SUM(amount_paid) FROM payments WHERE YEAR(paid_at) = ?");
    $stmtPrev->execute([$year - 1]);
    $prevRev = (float)$stmtPrev->fetchColumn() ?: 1; // Avoid div by zero
    $profitGrowth = (($totalRev - $prevRev) / $prevRev) * 100;

    // 3. CONVERSION LOGIC
    $stmtVisits = $pdo->prepare("SELECT COUNT(DISTINCT visitor_id) FROM site_visits WHERE YEAR(visit_date) = ?");
    $stmtVisits->execute([$year]);
    $uniqueVisits = (int)$stmtVisits->fetchColumn();

    $stmtBookings = $pdo->prepare("SELECT COUNT(id) FROM bookings WHERE YEAR(created_at) = ?");
    $stmtBookings->execute([$year]);
    $totalBookings = (int)$stmtBookings->fetchColumn();
    $convRate = ($uniqueVisits > 0) ? round(($totalBookings / $uniqueVisits) * 100, 1) : 0;

    // 4. MONTHLY CHART (Scaled for 0-100% UI)
    $chart = [];
    for ($m = 1; $m <= 12; $m++) {
        $mIn = $pdo->prepare("SELECT SUM(amount_paid) FROM payments WHERE MONTH(paid_at) = ? AND YEAR(paid_at) = ?");
        $mIn->execute([$m, $year]);
        $inc = (float)$mIn->fetchColumn() ?: 0;

        $mEx = $pdo->prepare("SELECT SUM(cost) FROM maintenance WHERE MONTH(scheduled_date) = ? AND YEAR(scheduled_date) = ?");
        $mEx->execute([$m, $year]);
        $maint = (float)$mEx->fetchColumn() ?: 0;

        $chart[] = [
            "m" => date('M', mktime(0, 0, 0, $m, 1)),
            "in" => round($inc / 1000, 1), // K1000 = 1% height in UI
            "ex" => round($maint / 1000, 1)
        ];
    }

    // 5. DEVICE SOURCES
    $stmtDev = $pdo->prepare("SELECT device, COUNT(*) as qty FROM site_visits GROUP BY device");
    $stmtDev->execute();
    $devs = $stmtDev->fetchAll(PDO::FETCH_KEY_PAIR);
    $totalD = array_sum($devs) ?: 1;

    // 6. FLEET & TELEMETRY
    $stmtFleet = $pdo->query("SELECT id, name as type, IFNULL(latitude, $defLat) as lat, IFNULL(longitude, $defLng) as lng, available FROM cars");

    echo json_encode([
        "success" => true,
        "netProfit" => $netProfit,
        "profitGrowth" => round($profitGrowth, 1),
        "conversionRate" => $convRate,
        "abv" => round($currentAbv, 2),
        "chart" => $chart,
        "fleet" => $stmtFleet->fetchAll(),
        "sources" => [
            "mobile" => round((($devs['mobile'] ?? 0) / $totalD) * 100),
            "desktop" => round((($devs['desktop'] ?? 0) / $totalD) * 100)
        ],
        "recentActivity" => $pdo->query("SELECT device as os, platform, visit_date FROM site_visits ORDER BY visit_date DESC LIMIT 4")->fetchAll()
    ]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}