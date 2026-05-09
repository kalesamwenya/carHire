<?php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

try {

    $pdo = getDB();

    /*
    |--------------------------------------------------------------------------
    | 1. USER DEMOGRAPHICS
    |--------------------------------------------------------------------------
    */

    $stmtUsers = $pdo->query("
        SELECT 
            COUNT(*) as total,

            SUM(CASE WHEN residency = 'Local' THEN 1 ELSE 0 END) as local_count,
            SUM(CASE WHEN residency = 'International' THEN 1 ELSE 0 END) as international_count,
            SUM(CASE WHEN residency = 'Corporate' THEN 1 ELSE 0 END) as corporate_count

        FROM users
        WHERE role = 'user'
    ");

    $userStats = $stmtUsers->fetch(PDO::FETCH_ASSOC);

    $totalUsers = (int)($userStats['total'] ?? 0);

    $safeTotalUsers = $totalUsers > 0 ? $totalUsers : 1;

    $demo = [
        "local" => round((($userStats['local_count'] ?? 0) / $safeTotalUsers) * 100),
        "int" => round((($userStats['international_count'] ?? 0) / $safeTotalUsers) * 100),
        "corp" => round((($userStats['corporate_count'] ?? 0) / $safeTotalUsers) * 100)
    ];


    /*
    |--------------------------------------------------------------------------
    | 2. FLEET CATEGORY DISTRIBUTION
    |--------------------------------------------------------------------------
    */

    $categoriesConfig = [
        ['name' => 'SUVs & 4x4', 'slug' => 'SUV', 'color' => 'bg-green-500'],
        ['name' => 'Luxury Sedans', 'slug' => 'Luxury', 'color' => 'bg-purple-500'],
        ['name' => 'Economy', 'slug' => 'Economy', 'color' => 'bg-blue-500'],
        ['name' => 'Vans / Bus', 'slug' => 'Van', 'color' => 'bg-orange-500'],
    ];

    $totalFleet = (int)$pdo->query("SELECT COUNT(*) FROM cars")->fetchColumn();

    $safeFleet = $totalFleet > 0 ? $totalFleet : 1;

    $fleetData = [];

    foreach ($categoriesConfig as $cat) {

        $stmtCat = $pdo->prepare("
            SELECT COUNT(*) 
            FROM cars 
            WHERE category LIKE ?
        ");

        $stmtCat->execute(["%" . $cat['slug'] . "%"]);

        $count = (int)$stmtCat->fetchColumn();

        $fleetData[] = [
            "name" => $cat['name'],
            "count" => $count,
            "percentage" => round(($count / $safeFleet) * 100),
            "color" => $cat['color']
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | 3. VEHICLE HEALTH
    |--------------------------------------------------------------------------
    */

    $stmtHealth = $pdo->query("
        SELECT 
            id,
            name,
            plate_number,
            mileage
        FROM cars
        ORDER BY mileage DESC
        LIMIT 3
    ");

    $vehicleHealth = [];

    while ($car = $stmtHealth->fetch(PDO::FETCH_ASSOC)) {

        $mileage = (int)($car['mileage'] ?? 0);

        $serviceInterval = 5000;

        $remaining = $serviceInterval - ($mileage % $serviceInterval);

        $healthPercent = round(($remaining / $serviceInterval) * 100);

        $vehicleHealth[] = [
            "model" => $car['name'],
            "plate" => $car['plate_number'] ?: ('ZM-' . $car['id']),
            "health" => $healthPercent,
            "kmLeft" => $remaining,
            "status" => $remaining <= 1000 ? 'Critical' : 'Healthy'
        ];
    }


    /*
    |--------------------------------------------------------------------------
    | 4. TOTAL DISTANCE
    |--------------------------------------------------------------------------
    */

    $totalDistance = (int)$pdo->query("
        SELECT COALESCE(SUM(mileage),0)
        FROM cars
    ")->fetchColumn();


    /*
    |--------------------------------------------------------------------------
    | 5. FUEL ESTIMATION
    |--------------------------------------------------------------------------
    | Approximation using 8km/L average
    */

    $fuelConsumed = round($totalDistance / 8);


    /*
    |--------------------------------------------------------------------------
    | 6. FLEET EFFICIENCY
    |--------------------------------------------------------------------------
    */

    $efficiency = $fuelConsumed > 0
        ? round($totalDistance / $fuelConsumed, 1)
        : 0;


    /*
    |--------------------------------------------------------------------------
    | 7. TOP UTILIZED VEHICLE
    |--------------------------------------------------------------------------
    */

    $stmtTopCar = $pdo->query("
        SELECT 
            c.name,
            COUNT(b.id) as total_bookings

        FROM bookings b

        INNER JOIN cars c 
            ON b.car_id = c.id

        GROUP BY b.car_id

        ORDER BY total_bookings DESC

        LIMIT 1
    ");

    $topCar = $stmtTopCar->fetch(PDO::FETCH_ASSOC);


    /*
    |--------------------------------------------------------------------------
    | FINAL RESPONSE
    |--------------------------------------------------------------------------
    */

    echo json_encode([
        "success" => true,

        "totalUsers" => $totalUsers,

        "demo" => $demo,

        "categories" => $fleetData,

        "vehicleHealth" => $vehicleHealth,

        "totalFleet" => $totalFleet,

        "metrics" => [
            "dist" => $totalDistance,
            "fuel" => $fuelConsumed,
            "eff" => $efficiency,
            "topCar" => $topCar['name'] ?? 'N/A'
        ]
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}