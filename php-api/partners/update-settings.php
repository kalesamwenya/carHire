<?php
// File: partners/update-settings.php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId   = $_POST['user_id'] ?? null;
    $bizName  = $_POST['business_name'] ?? '';
    $phone    = $_POST['phone'] ?? '';
    $bio      = $_POST['bio'] ?? '';
    $taxId    = $_POST['tax_id'] ?? '';
    $idNum    = $_POST['id_number'] ?? '';
    $address  = $_POST['address_line1'] ?? '';
    $city     = $_POST['city'] ?? '';
    $bank     = $_POST['bank_name'] ?? '';
    $accNum   = $_POST['account_number'] ?? '';

    if (!$userId) {
        echo json_encode(["success" => false, "message" => "User ID is missing"]);
        exit;
    }

    $pdo = getDB();
    
    try {
        $pdo->beginTransaction();

        // 1. Update User Table (Name)
        $stmt1 = $pdo->prepare("UPDATE users SET name = ? WHERE id = ?");
        $stmt1->execute([$bizName, $userId]);

        // 2. Handle Avatar Upload
        if (isset($_FILES['avatar'])) {
            $ext = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
            $fileName = "avatar_" . $userId . "_" . time() . "." . $ext;
            $uploadPath = "../../uploads/avatars/" . $fileName;
            
            if (move_uploaded_file($_FILES['avatar']['tmp_name'], $uploadPath)) {
                $dbPath = "uploads/avatars/" . $fileName;
                $stmtImg = $pdo->prepare("UPDATE users SET image = ? WHERE id = ?");
                $stmtImg->execute([$dbPath, $userId]);
            }
        }

        // 3. Update/Insert partner_about Table
        // Added all missing columns to the SQL statement
        $stmt2 = $pdo->prepare("
            INSERT INTO partner_about (
                user_id, business_name, phone, bio, tax_id, id_number, address_line1, city, bank_name, account_number
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                business_name = VALUES(business_name),
                phone = VALUES(phone),
                bio = VALUES(bio),
                tax_id = VALUES(tax_id),
                id_number = VALUES(id_number),
                address_line1 = VALUES(address_line1),
                city = VALUES(city),
                bank_name = VALUES(bank_name),
                account_number = VALUES(account_number)
        ");
        
        $stmt2->execute([$userId, $bizName, $phone, $bio, $taxId, $idNum, $address, $city, $bank, $accNum]);

        $pdo->commit();
        echo json_encode(["success" => true]);

    } catch (Exception $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}