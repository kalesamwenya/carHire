<?php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');
$pdo = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['id'])) {
        echo json_encode(["success" => false, "message" => "Vehicle ID is required"]);
        exit;
    }

    try {
        // We include featured_image here in case the user changed the primary photo
        $sql = "UPDATE cars SET 
                    name = ?, 
                    price_per_day = ?, 
                    available = ?, 
                    transmission = ?, 
                    fuel = ?, 
                    description = ?, 
                    color = ?,
                    featured_image = ?
                WHERE id = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['price_per_day'],
            $data['available'],
            $data['transmission'],
            $data['fuel'],
            $data['description'],
            $data['color'],
            $data['featured_image'] ?? null, // New field for Emit Photography
            $data['id']
        ]);

        // Optional: If a featured_image was sent, sync it in the car_images table too
        if (!empty($data['featured_image'])) {
            // Set all images for this car to NOT featured
            $pdo->prepare("UPDATE car_images SET is_featured = 0 WHERE car_id = ?")
                ->execute([$data['id']]);
            // Set the specific one to featured
            $pdo->prepare("UPDATE car_images SET is_featured = 1 WHERE car_id = ? AND image_url = ?")
                ->execute([$data['id'], $data['featured_image']]);
        }

        echo json_encode(["success" => true, "message" => "Vehicle updated successfully"]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }
}