<?php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

$partnerId = $_GET['partner_id'] ?? null;

if (!$partnerId) {

    echo json_encode([
        "success" => false,
        "message" => "Partner ID required"
    ]);

    exit;
}

$pdo = getDB();

try {

    // ============================================
    // MONTHLY REVENUE (LAST 6 MONTHS)
    // ============================================
    $revenueStmt = $pdo->prepare("
        SELECT 
            DATE_FORMAT(b.pickup_date, '%b') AS month,
            COALESCE(SUM(b.total_price), 0) AS total

        FROM bookings b

        INNER JOIN cars c 
            ON b.car_id = c.id

        WHERE c.partner_id = ?
        AND b.status IN (
            'confirmed',
            'completed',
            'upcoming',
            'Reserved'
        )

        AND b.pickup_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)

        GROUP BY 
            YEAR(b.pickup_date),
            MONTH(b.pickup_date)

        ORDER BY b.pickup_date ASC
    ");

    $revenueStmt->execute([$partnerId]);

    $monthlyRevenue = $revenueStmt->fetchAll(PDO::FETCH_ASSOC);

    // ============================================
    // VEHICLE UTILIZATION
    // ============================================
    $utilStmt = $pdo->prepare("
        SELECT 
            c.id,
            c.name,

            COALESCE(
                SUM(
                    DATEDIFF(
                        b.return_date,
                        b.pickup_date
                    )
                ),
                0
            ) AS booked_days

        FROM cars c

        LEFT JOIN bookings b 
            ON c.id = b.car_id
            AND b.status IN (
                'confirmed',
                'completed',
                'upcoming',
                'Reserved'
            )

        WHERE c.partner_id = ?

        GROUP BY c.id

        ORDER BY booked_days DESC
    ");

    $utilStmt->execute([$partnerId]);

    $utilization = $utilStmt->fetchAll(PDO::FETCH_ASSOC);

    // ============================================
    // FORMAT UTILIZATION
    // ============================================
    foreach ($utilization as &$vehicle) {

        /**
         * Based on 30 day utilization cycle
         */
        $percent =
            ($vehicle['booked_days'] / 30) * 100;

        $vehicle['percentage'] = min(
            round($percent),
            100
        );
    }

    // ============================================
    // TOTAL REVENUE
    // ============================================
    $totalRevenueStmt = $pdo->prepare("
        SELECT 
            COALESCE(SUM(b.total_price), 0) AS total

        FROM bookings b

        INNER JOIN cars c 
            ON b.car_id = c.id

        WHERE c.partner_id = ?
        AND b.status IN (
            'confirmed',
            'completed',
            'upcoming',
            'Reserved'
        )
    ");

    $totalRevenueStmt->execute([$partnerId]);

    $totalRevenue =
        (float)$totalRevenueStmt->fetchColumn();

    // ============================================
    // TOTAL BOOKINGS
    // ============================================
    $bookingStmt = $pdo->prepare("
        SELECT COUNT(*) 

        FROM bookings b

        INNER JOIN cars c
            ON b.car_id = c.id

        WHERE c.partner_id = ?
    ");

    $bookingStmt->execute([$partnerId]);

    $totalBookings =
        (int)$bookingStmt->fetchColumn();

    // ============================================
    // ACTIVE VEHICLES
    // ============================================
    $vehicleStmt = $pdo->prepare("
        SELECT COUNT(*)

        FROM cars

        WHERE partner_id = ?
        AND available = 1
    ");

    $vehicleStmt->execute([$partnerId]);

    $activeVehicles =
        (int)$vehicleStmt->fetchColumn();

    // ============================================
    // AVERAGE UTILIZATION
    // ============================================
    $avgUtilization = 0;

    if (count($utilization) > 0) {

        $totalPercent = array_sum(
            array_column(
                $utilization,
                'percentage'
            )
        );

        $avgUtilization =
            round(
                $totalPercent / count($utilization)
            );
    }

    // ============================================
    // RESPONSE
    // ============================================
    echo json_encode([

        "success" => true,

        "stats" => [

            "total_revenue" =>
                $totalRevenue,

            "avg_utilization" =>
                $avgUtilization,

            "total_bookings" =>
                $totalBookings,

            "active_vehicles" =>
                $activeVehicles
        ],

        "revenue" =>
            $monthlyRevenue,

        "utilization" =>
            $utilization
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([

        "success" => false,

        "message" =>
            $e->getMessage()
    ]);
}