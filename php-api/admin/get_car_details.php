<?php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');
$pdo = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id = $_GET['id'] ?? null;

    if (!$id) {
        echo json_encode(["success" => false, "message" => "Vehicle ID required"]);
        exit;
    }

    try {
        // 1. Fetch Car Details + Image Gallery
        $stmt = $pdo->prepare("
            SELECT c.*, 
                   GROUP_CONCAT(i.image_url ORDER BY i.is_featured DESC, i.id ASC) as gallery
            FROM cars c
            LEFT JOIN car_images i ON c.id = i.car_id
            WHERE c.id = ?
            GROUP BY c.id
        ");
        $stmt->execute([$id]);
        $car = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$car) {
            echo json_encode(["success" => false, "message" => "Vehicle not found"]);
            exit;
        }

        // Process Gallery and Standardize Image Key for Frontend
        $galleryArray = $car['gallery'] ? explode(',', $car['gallery']) : [];
        $car['images'] = $galleryArray;
        
        // Match the frontend's 'image_url' expectation
        $car['image_url'] = $car['featured_image'] ?: ($galleryArray[0] ?? null);
        
        unset($car['gallery']); // Clean up

        // 2. Fetch Booking Activities
        $stmtB = $pdo->prepare("
            SELECT b.*, u.name as user_name 
            FROM bookings b 
            JOIN users u ON b.user_id = u.id 
            WHERE b.car_id = ? 
            ORDER BY b.pickup_date DESC
        ");
        $stmtB->execute([$id]);
        $bookings = $stmtB->fetchAll(PDO::FETCH_ASSOC);

        // 3. Fetch Service Logs (Ensure table name matches 'service_logs' or 'car_services')
        // Check your DB: if the table is 'car_services', keep it. If 'service_logs', change it.
        $stmtS = $pdo->prepare("SELECT * FROM service_logs WHERE car_id = ? ORDER BY service_date DESC");
        $stmtS->execute([$id]);
        $serviceLogs = $stmtS->fetchAll(PDO::FETCH_ASSOC);

        // 4. Calculate Stats
        $lastServiceDate = !empty($serviceLogs) ? $serviceLogs[0]['service_date'] : 'Never';
        $isOverdue = true; 

        if (!empty($serviceLogs)) {
            $lastDate = new DateTime($lastServiceDate);
            $today = new DateTime();
            $diff = $today->diff($lastDate);
            if ($diff->days < 180 && $lastDate <= $today) {
                $isOverdue = false;
            }
        }

        $totalRevenue = 0;
        foreach($bookings as $b) { 
            if(strtolower($b['status']) === 'completed') {
                $totalRevenue += (float)$b['total_price']; 
            }
        }

        echo json_encode([
            "success" => true,
            "car" => $car,
            "bookings" => $bookings,
            "service_logs" => $serviceLogs,
            "stats" => [
                "total_trips" => count($bookings),
                "total_revenue" => $totalRevenue,
                "is_overdue" => $isOverdue,
                "last_service_date" => $lastServiceDate
            ]
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database Error: " . $e->getMessage()]);
    }
}   else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
}