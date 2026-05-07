<?php
// File: api/partner/get-kyc-status.php
require_once '../config/origin.php';
require_once '../config/config.php';
header('Content-Type: application/json');

$userId = $_GET['user_id'] ?? null;

if (!$userId) {
    echo json_encode(["success" => false, "message" => "Missing User ID"]);
    exit;
}

$pdo = getDB();

try {
    $stmt = $pdo->prepare("SELECT kyc_status FROM partner_about WHERE user_id = ?");
    $stmt->execute([$userId]);
    $partner = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($partner) {
        echo json_encode([
            "success" => true,
            "kyc_status" => $partner['kyc_status']
        ]);
    } else {
        echo json_encode(["success" => true, "kyc_status" => "pending"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}