<?php
// File: admin/update-kyc-status.php
require_once '../config/origin.php';
require_once '../config/config.php';
$data = json_decode(file_get_contents('php://input'));

if (isset($data->user_id) && isset($data->status)) {
    $pdo = getDB();
    $stmt = $pdo->prepare("UPDATE partner_about SET kyc_status = ? WHERE user_id = ?");
    if ($stmt->execute([$data->status, $data->user_id])) {
        echo json_encode(["status" => "success"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid input."]);
}