<?php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');
$pdo = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id = $_GET['id'] ?? null;
    if (!$id) { 
        echo json_encode(["success" => false, "message" => "User ID required"]); 
        exit; 
    }

    try {
        // Fetch User and calculate metrics in SQL
        $stmt = $pdo->prepare("
            SELECT u.*, 
            (SELECT SUM(total_price) FROM bookings WHERE user_id = u.id AND payment_status = 'paid') as total_revenue,
            (SELECT COUNT(*) FROM bookings WHERE user_id = u.id AND status = 'completed') as completed_trips,
            (SELECT COUNT(*) FROM bookings WHERE user_id = u.id AND status = 'cancelled') as cancellations
            FROM users u WHERE u.id = ?
        ");
        $stmt->execute([$id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            echo json_encode(["success" => false, "message" => "User not found"]);
            exit;
        }

        // --- Business Logic for Loyalty & Performance ---
        // 1 Point for every K100 spent
        $user['loyalty_points'] = floor(($user['total_revenue'] ?? 0) / 100);
        
        // Reliability Score (Percentage)
        $totalRelevant = (int)$user['completed_trips'] + (int)$user['cancellations'];
        $user['reliability_score'] = ($totalRelevant > 0) 
            ? round(((int)$user['completed_trips'] / $totalRelevant) * 100) 
            : 100; // Default to 100 for new users

        // Fetch All Bookings
        $stmtB = $pdo->prepare("
            SELECT b.*, c.name as car_name, c.plate_number, c.image_url 
            FROM bookings b 
            JOIN cars c ON b.car_id = c.id 
            WHERE b.user_id = ? 
            ORDER BY b.pickup_date DESC
        ");
        $stmtB->execute([$id]);
        $bookings = $stmtB->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true, 
            "user" => $user, 
            "bookings" => $bookings
        ]);

    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}