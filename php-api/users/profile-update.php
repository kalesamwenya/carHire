<?php
// File: users/profile-update.php
require_once '../config/origin.php'; 
require_once '../config/config.php'; 

header('Content-Type: application/json');
$pdo = getDB();

// For Image Uploads, we check $_POST instead of php://input
$userId = $_POST['user_id'] ?? null;

if (!$userId) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "User ID is required"]);
    exit;
}

try {
    $pdo->beginTransaction();
    $imagePath = $_POST['current_image'] ?? null;

    // Handle File Upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../uploads/profiles/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

        $fileExtension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $fileName = "profile_" . $userId . "_" . time() . "." . $fileExtension;
        $targetFile = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
            // Store the public URL path
            $imagePath = '/uploads/profiles/' . $fileName;
        }
    }

    // 1. Update main users table (including image)
    $stmt1 = $pdo->prepare("
        UPDATE users 
        SET phone = ?, driver_license = ?, image = ? 
        WHERE id = ?
    ");
    $stmt1->execute([
        $_POST['phone'] ?? null, 
        $_POST['driver_license'] ?? null, 
        $imagePath,
        $userId
    ]);

    // 2. Update users_about table
    $stmt2 = $pdo->prepare("
        INSERT INTO users_about (user_id, bio, location, hobbies, occupation) 
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            bio = VALUES(bio), location = VALUES(location), 
            hobbies = VALUES(hobbies), occupation = VALUES(occupation)
    ");
    $stmt2->execute([
        $userId, 
        $_POST['bio'] ?? null, 
        $_POST['location'] ?? null, 
        $_POST['hobbies'] ?? null,
        $_POST['occupation'] ?? null
    ]);

    $pdo->commit();
    echo json_encode(["success" => true, "message" => "Profile and image updated!", "image" => $imagePath]);

} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}