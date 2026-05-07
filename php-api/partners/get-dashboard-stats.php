<?php
// File: partners/get-dashboard-stats.php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = $_GET['user_id'] ?? null;

    if (!$userId) {
        echo json_encode(["success" => false, "message" => "User ID required"]);
        exit;
    }

    $pdo = getDB();

    try {
        // 1. Get Total Earnings (Sum of completed bookings)
        $stmtEarnings = $pdo->prepare("
            SELECT SUM(total_price) as total 
            FROM bookings b
            JOIN vehicles v ON b.vehicle_id = v.id
            WHERE v.partner_id = ? AND b.status = 'Completed'
        ");
        $stmtEarnings->execute([$userId]);
        $totalEarnings = $stmtEarnings->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;

        // 2. Get Active Bookings Count
        $stmtActive = $pdo->prepare("
            SELECT COUNT(*) as count 
            FROM bookings b
            JOIN vehicles v ON b.vehicle_id = v.id
            WHERE v.partner_id = ? AND b.status = 'Confirmed'
        ");
        $stmtActive->execute([$userId]);
        $activeBookings = $stmtActive->fetch(PDO::FETCH_ASSOC)['count'] ?? 0;

        // 3. Get Fleet Utilization (Cars currently rented vs Total cars)
        $stmtFleet = $pdo->prepare("
            SELECT 
                COUNT(*) as total_cars,
                SUM(CASE WHEN status = 'Rented' THEN 1 ELSE 0 END) as rented_cars
            FROM vehicles 
            WHERE partner_id = ?
        ");
        $stmtFleet->execute([$userId]);
        $fleetStats = $stmtFleet->fetch(PDO::FETCH_ASSOC);

        // 4. Get Monthly Revenue Data (For your Chart)
        $stmtChart = $pdo->prepare("
            SELECT 
                DATE_FORMAT(b.created_at, '%b') as month,
                SUM(b.total_price) as revenue
            FROM bookings b
            JOIN vehicles v ON b.vehicle_id = v.id
            WHERE v.partner_id = ? AND b.status = 'Completed'
            GROUP BY MONTH(b.created_at)
            ORDER BY MONTH(b.created_at) ASC
            LIMIT 6
        ");
        $stmtChart->execute([$userId]);
        $chartData = $stmtChart->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "data" => [
                "totalEarnings" => (float)$totalEarnings,
                "activeBookings" => (int)$activeBookings,
                "totalCars" => (int)$fleetStats['total_cars'],
                "rentedCars" => (int)$fleetStats['rented_cars'],
                "chartData" => $chartData ?: []
            ]
        ]);

    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}