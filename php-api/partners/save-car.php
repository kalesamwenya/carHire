<?php
require_once '../config/origin.php';
require_once '../config/config.php';
require_once '../config/NotificationHelper.php';
header('Content-Type: application/json');

$db = getDB();
$upload_dir = "../uploads/cars/"; 
if (!is_dir($upload_dir)) { mkdir($upload_dir, 0755, true); }

// 2. EXTRACT DATA
$raw_partner = $_POST['partner_id'] ?? '';
$partner_id = (trim($raw_partner) === '' || $raw_partner === '0' || $raw_partner === 'null') ? null : (int)$raw_partner;

// Get the cover index from the frontend (defaults to 0 if not provided)
$cover_index = isset($_POST['cover_index']) ? (int)$_POST['cover_index'] : 0;

$make         = $_POST['make'] ?? '';
$model        = $_POST['model'] ?? '';
$car_name     = $_POST['name'] ?? trim("$make $model");
$category     = $_POST['category'] ?? 'economic';
$price        = $_POST['daily_rate'] ?? 0;
$desc         = $_POST['description'] ?? '';
$trans        = $_POST['transmission'] ?? 'Automatic';
$fuel         = $_POST['fuel_type'] ?? 'Petrol';
$seats        = $_POST['seats'] ?? 5;
$color        = $_POST['color'] ?? '';
$plate        = $_POST['plate_number'] ?? '';
$mileage      = $_POST['mileage'] ?? 0;

if (empty($car_name) || empty($plate)) {
    echo json_encode(["status" => "error", "message" => "Name and Plate are required."]);
    exit;
}

try {
    $db->beginTransaction(); 

    // 3. INSERT CAR
    $sql = "INSERT INTO cars (
                name, category, type, price_per_day, description, 
                transmission, fuel, seats, color, plate_number, 
                available, mileage, partner_id, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, NOW())";
    
    $stmt = $db->prepare($sql);
    $stmt->execute([
        $car_name, $category, $car_name, $price, $desc,
        $trans, $fuel, $seats, $color, $plate, $mileage, $partner_id
    ]);

    $car_id = $db->lastInsertId();
    $uploaded_paths = [];

    // 4. PROCESS MULTI-IMAGES
    if (!empty($_FILES['images']['name'][0])) {
        $files = $_FILES['images'];
        foreach ($files['tmp_name'] as $key => $tmp_name) {
            if ($files['error'][$key] !== UPLOAD_ERR_OK) continue;

            $ext = pathinfo($files['name'][$key], PATHINFO_EXTENSION);
            $safe_name = bin2hex(random_bytes(8)) . "_" . time() . "." . $ext;
            $final_path = "/uploads/cars/" . $safe_name;

            if (move_uploaded_file($tmp_name, $upload_dir . $safe_name)) {
                
                // FEATURE LOGIC: Check if this specific key is the selected cover
                $is_featured = ($key === $cover_index) ? 1 : 0;

                $img_sql = "INSERT INTO car_images (car_id, image_url, is_featured) VALUES (?, ?, ?)";
                $db->prepare($img_sql)->execute([$car_id, $final_path, $is_featured]);

                // Update the main car table with the featured image path
                if ($is_featured) {
                    $db->prepare("UPDATE cars SET featured_image = ? WHERE id = ?")
                       ->execute([$final_path, $car_id]);
                }
                
                $uploaded_paths[] = $upload_dir . $safe_name;
            }
        }
    }

    $db->commit();

        NotificationHelper::create(
    $pdo,
    'New Booking',
    $cust_name . ' created booking #' . $booking_id,
    'success',
    $booking_id,
    'booking'
);

    echo json_encode(["status" => "success", "message" => "Vehicle and images saved successfully!", "car_id" => $car_id]);


    

} catch (Exception $e) {
    $db->rollBack();
    if (!empty($uploaded_paths)) {
        foreach ($uploaded_paths as $path) { @unlink($path); }
    }
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}