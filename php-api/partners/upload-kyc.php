<?php
// File: partners/upload-kyc.php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = $_POST['user_id'] ?? null;

    if (!$userId) {
        echo json_encode(["success" => false, "message" => "User ID required"]);
        exit;
    }

    $pdo = getDB();
    
    try {
        $pdo->beginTransaction();

        // 1. Prepare Directory: uploads/kyc/{user_id}/
        $userDir = "../uploads/kyc/" . $userId . "/";
        if (!is_dir($userDir)) {
            mkdir($userDir, 0777, true);
        }

        $idFrontPath = null;
        $idBackPath = null;

        // 2. Handle ID Front Upload
        if (isset($_FILES['id_front']) && $_FILES['id_front']['error'] === UPLOAD_ERR_OK) {
            $ext = pathinfo($_FILES['id_front']['name'], PATHINFO_EXTENSION);
            $frontName = "front_" . time() . "." . $ext;
            if (move_uploaded_file($_FILES['id_front']['tmp_name'], $userDir . $frontName)) {
                $idFrontPath = "uploads/kyc/" . $userId . "/" . $frontName;
            }
        }

        // 3. Handle ID Back Upload
        if (isset($_FILES['id_back']) && $_FILES['id_back']['error'] === UPLOAD_ERR_OK) {
            $ext = pathinfo($_FILES['id_back']['name'], PATHINFO_EXTENSION);
            $backName = "back_" . time() . "." . $ext;
            if (move_uploaded_file($_FILES['id_back']['tmp_name'], $userDir . $backName)) {
                $idBackPath = "uploads/kyc/" . $userId . "/" . $backName;
            }
        }

        if (!$idFrontPath || !$idBackPath) {
            throw new Exception("Both front and back ID images are required.");
        }

        // 4. Update partner_about with paths and set status to pending
        $stmt = $pdo->prepare("
            UPDATE partner_about 
            SET id_number = ?, 
                id_front_path = ?, 
                id_back_path = ?, 
                kyc_status = 'pending' 
            WHERE user_id = ?
        ");
        
        // Note: I included 'id_number' assuming it's sent via $_POST['id_number']
        $idNumber = $_POST['id_number'] ?? '';
        $stmt->execute([$idNumber, $idFrontPath, $idBackPath, $userId]);

        $pdo->commit();
        echo json_encode([
            "success" => true, 
            "message" => "KYC documents uploaded. Status set to pending."
        ]);

    } catch (Exception $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}