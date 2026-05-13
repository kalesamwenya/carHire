<?php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

$userId = $_GET['partner_id'] ?? null;

if (!$userId) {
    echo json_encode([
        "success" => false,
        "message" => "Partner ID required"
    ]);
    exit;
}

$pdo = getDB();

try {

    /**
     * MAIN QUERY
     * We calculate:
     * - trips (count of bookings)
     * - earnings (sum of total_price where NOT cancelled)
     */

    $stmt = $pdo->prepare("
        SELECT 
            c.id,
            c.name,
            c.plate_number AS plate,

            COUNT(b.id) AS trips,

            COALESCE(
                SUM(
                    CASE 
                        WHEN b.status != 'Cancelled' 
                        THEN b.total_price 
                        ELSE 0 
                    END
                ), 0
            ) AS earnings,

            0 AS expenses

        FROM cars c

        LEFT JOIN bookings b 
            ON b.car_id = c.id

        WHERE c.partner_id = ?

        GROUP BY c.id, c.name, c.plate_number

        ORDER BY c.created_at DESC
    ");

    $stmt->execute([$userId]);
    $fleet = $stmt->fetchAll(PDO::FETCH_ASSOC);

    /**
     * FORMAT FOR FRONTEND SAFETY
     */
    foreach ($fleet as &$car) {
        $car['trips'] = (int) $car['trips'];
        $car['earnings'] = (float) $car['earnings'];
        $car['expenses'] = (float) $car['expenses'];
    }

    echo json_encode([
        "success" => true,
        "data" => $fleet
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database Error: " . $e->getMessage()
    ]);
}