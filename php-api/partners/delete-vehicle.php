<?php
// File: partners/delete-vehicle.php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $vehicleId = $data['vehicle_id'] ?? null;
    $raw_user  = $data['user_id'] ?? '';
    // If it's an Admin deleting, user_id might be empty or 'null'
    $userId    = (trim($raw_user) === '' || $raw_user === '0' || $raw_user === 'null') ? null : (int)$raw_user;

    if (!$vehicleId) {
        echo json_encode(["success" => false, "message" => "Vehicle ID required"]);
        exit;
    }

    $pdo = getDB();

    try {
        $pdo->beginTransaction();

        // 1. Check ownership and fetch all image paths
        // If userId is null, we assume an Admin is deleting, otherwise check partner_id
        if ($userId !== null) {
            $stmt = $pdo->prepare("SELECT id FROM cars WHERE id = ? AND partner_id = ?");
            $stmt->execute([$vehicleId, $userId]);
        } else {
            $stmt = $pdo->prepare("SELECT id FROM cars WHERE id = ? AND partner_id IS NULL");
            $stmt->execute([$vehicleId]);
        }

        if (!$stmt->fetch()) {
            echo json_encode(["success" => false, "message" => "Vehicle not found or unauthorized"]);
            $pdo->rollBack();
            exit;
        }

        // 2. Get all image paths from car_images table
        $imgStmt = $pdo->prepare("SELECT image_url FROM car_images WHERE car_id = ?");
        $imgStmt->execute([$vehicleId]);
        $images = $imgStmt->fetchAll(PDO::FETCH_COLUMN);

        // 3. Delete the vehicle record
        // (Assuming ON DELETE CASCADE is set on car_images table, 
        // the database will automatically remove rows in car_images)
        $deleteStmt = $pdo->prepare("DELETE FROM cars WHERE id = ?");
        $deleteStmt->execute([$vehicleId]);

        if ($deleteStmt->rowCount() > 0) {
            // 4. Clean up physical files from storage
            foreach ($images as $imgUrl) {
                // Adjusting path: __DIR__ is partners/, we need to go up to root
                $filePath = __DIR__ . '/..' . $imgUrl; 
                if (file_exists($filePath)) {
                    @unlink($filePath);
                }
            }

            $pdo->commit();
            echo json_encode([
                "success" => true,
                "message" => "Vehicle and " . count($images) . " images permanently deleted."
            ]);
        } else {
            $pdo->rollBack();
            echo json_encode(["success" => false, "message" => "Failed to remove vehicle record"]);
        }

    } catch (PDOException $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}