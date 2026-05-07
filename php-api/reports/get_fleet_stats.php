<?php
require_once '../config/origin.php';
require_once '../config/config.php';

try {
    $pdo = getDB();

    // 1. CALCULATE REAL RESIDENCY STATS
    $stmtUsers = $pdo->query("SELECT COUNT(*) as total, 
        SUM(CASE WHEN residency = 'Local' THEN 1 ELSE 0 END) as local_count,
        SUM(CASE WHEN residency = 'International' THEN 1 ELSE 0 END) as int_count,
        SUM(CASE WHEN residency = 'Corporate' THEN 1 ELSE 0 END) as corp_count
        FROM users WHERE role = 'user'");
    
    $userStats = $stmtUsers->fetch();
    $totalU = (int)$userStats['total'] ?: 1; // Prevent division by zero

    $demo = [
        "local" => round(($userStats['local_count'] / $totalU) * 100),
        "int" => round(($userStats['int_count'] / $totalU) * 100),
        "corp" => round(($userStats['corp_count'] / $totalU) * 100)
    ];

    // 2. FLEET CATEGORY DISTRIBUTION
    // We use a LEFT JOIN or specific counts to handle the new 'category' column
    $categories = [
        ['name' => 'SUVs & 4x4', 'slug' => 'SUV', 'color' => 'bg-green-500'],
        ['name' => 'Luxury Sedans', 'slug' => 'Luxury', 'color' => 'bg-purple-500'],
        ['name' => 'Economy', 'slug' => 'Economy', 'color' => 'bg-blue-500'],
        ['name' => 'Vans / Bus', 'slug' => 'Van', 'color' => 'bg-orange-500'],
    ];

    $fleetData = [];
    $totalCars = (int)$pdo->query("SELECT COUNT(*) FROM cars")->fetchColumn() ?: 1;

    foreach ($categories as $cat) {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM cars WHERE category = ?");
        $stmt->execute([$cat['slug']]);
        $count = (int)$stmt->fetchColumn();
        
        $fleetData[] = [
            'name' => $cat['name'],
            'count' => $count,
            'percentage' => round(($count / $totalCars) * 100),
            'color' => $cat['color']
        ];
    }

    // 3. VEHICLE HEALTH (Service Warnings)
    $stmtHealth = $pdo->query("SELECT name, id, mileage FROM cars ORDER BY mileage DESC LIMIT 3");
    $healthData = [];
    while ($row = $stmtHealth->fetch()) {
        $nextService = 5000;
        $remain = $nextService - ($row['mileage'] % $nextService);
        $healthData[] = [
            "model" => $row['name'],
            "plate" => "ZM-" . $row['id'],
            "health" => round(($remain / $nextService) * 100),
            "kmLeft" => $remain,
            "status" => $remain < 1000 ? "Critical" : "Healthy"
        ];
    }

    echo json_encode([
        "success" => true,
        "totalUsers" => (int)$userStats['total'],
        "demo" => $demo,
        "categories" => $fleetData,
        "vehicleHealth" => $healthData,
        "totalFleet" => (int)$totalCars,
        "metrics" => ["dist" => 12450, "fuel" => 1850, "eff" => 6.7, "topCar" => "Toyota Hilux"]
    ]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}