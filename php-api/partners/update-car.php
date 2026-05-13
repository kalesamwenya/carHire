<?php
// File: admin/update-car.php
require_once '../config/origin.php';
require_once '../config/config.php';
require_once '../config/NotificationHelper.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pdo = getDB();

    // Mapping frontend keys to backend variables
    $vehicleId    = $_POST['id'] ?? null; // Frontend sends 'id'
    $raw_partner  = $_POST['partner_id'] ?? '';
    $partnerId    = (trim($raw_partner) === '' || $raw_partner === '0' || $raw_partner === 'null') ? null : (int)$raw_partner;
    
    $name         = $_POST['name'] ?? '';
    $make         = $_POST['make'] ?? '';
    $model        = $_POST['model'] ?? '';
    $category     = $_POST['category'] ?? 'suv';
    $dailyRate    = $_POST['daily_rate'] ?? null; // Matched to frontend 'daily_rate'
    $minDays      = (int)($_POST['min_days'] ?? 1); // New field
    $transmission = $_POST['transmission'] ?? 'Automatic';
    $fuel         = $_POST['fuel_type'] ?? 'Petrol'; // Matched to frontend 'fuel_type'
    $seats        = (int)($_POST['seats'] ?? 5);
    $mileage      = (int)($_POST['mileage'] ?? 0);
    $description  = $_POST['description'] ?? '';
    
    // Logic for images: Frontend sends a JSON array of URLs that should remain
    $existingImages = isset($_POST['existing_images']) ? json_decode($_POST['existing_images'], true) : [];

    if (!$vehicleId) {
        echo json_encode(["success" => false, "message" => "Missing Vehicle ID"]);
        exit;
    }

    try {
        $pdo->beginTransaction();

        // --- 1. HANDLE IMAGE DELETION ---
        // Find images in DB that are NOT in the 'existingImages' list sent by frontend
        $stmt = $pdo->prepare("SELECT id, image_url FROM car_images WHERE car_id = ?");
        $stmt->execute([$vehicleId]);
        $dbImages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($dbImages as $dbImg) {
            if (!in_array($dbImg['image_url'], $existingImages)) {
                // Delete physical file
                $filePath = __DIR__ . '/..' . $dbImg['image_url']; 
                if (file_exists($filePath) && !is_dir($filePath)) { 
                    @unlink($filePath); 
                }
                // Delete from DB
                $pdo->prepare("DELETE FROM car_images WHERE id = ?")->execute([$dbImg['id']]);
            }
        }

        // --- 2. HANDLE NEW UPLOADS ---
        if (isset($_FILES['images']) && !empty($_FILES['images']['name'][0])) {
            $uploadDir = '../uploads/cars/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

            foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
                if ($_FILES['images']['error'][$key] === UPLOAD_ERR_OK) {
                    $ext = strtolower(pathinfo($_FILES['images']['name'][$key], PATHINFO_EXTENSION));
                    $newFileName = bin2hex(random_bytes(8)) . "_" . time() . "." . $ext;
                    
                    if (move_uploaded_file($tmpName, $uploadDir . $newFileName)) {
                        $finalPath = '/uploads/cars/' . $newFileName;
                        $pdo->prepare("INSERT INTO car_images (car_id, image_url, is_featured) VALUES (?, ?, 0)")
                            ->execute([$vehicleId, $finalPath]);
                    }
                }
            }
        }

        // --- 3. RE-SYNC FEATURED IMAGE ---
        // Set all to 0, then pick the first one available as the featured image
        $pdo->prepare("UPDATE car_images SET is_featured = 0 WHERE car_id = ?")->execute([$vehicleId]);
        $pdo->prepare("UPDATE car_images SET is_featured = 1 WHERE car_id = ? LIMIT 1")->execute([$vehicleId]);
        
        $stmt = $pdo->prepare("SELECT image_url FROM car_images WHERE car_id = ? AND is_featured = 1 LIMIT 1");
        $stmt->execute([$vehicleId]);
        $newFeatured = $stmt->fetchColumn() ?: ''; 

        // --- 4. UPDATE MAIN CAR TABLE ---
        // Added make, model, description, and min_days
        $updateSql = "UPDATE cars SET 
                        name = ?, 
                        make = ?, 
                        type = ?, 
                        category = ?, 
                        price_per_day = ?, 
                        min_booking_days = ?,
                        transmission = ?, 
                        fuel = ?, 
                        seats = ?, 
                        mileage = ?, 
                        description = ?,
                        featured_image = ?, 
                        partner_id = ?
                      WHERE id = ?";
        
        $pdo->prepare($updateSql)->execute([
            $name, 
            $make, 
            $model, 
            $category, 
            $dailyRate, 
            $minDays,
            $transmission, 
            $fuel, 
            $seats, 
            $mileage, 
            $description,
            $newFeatured, 
            $partnerId, 
            $vehicleId
        ]);

        $pdo->commit();
        
        NotificationHelper::create(
    $pdo,
    'Vehicle Updated',
    $name . ' vehicle details were updated.',
    'info',
    $vehicleId,
    'vehicle'
);
        echo json_encode(["success" => true, "message" => "Vehicle updated successfully"]);

    } catch (Exception $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        echo json_encode(["success" => false, "message" => "Database Error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}