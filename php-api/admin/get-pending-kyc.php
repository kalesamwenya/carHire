<?php
// File: admin/get-pending-kyc.php
require_once '../config/origin.php';
require_once '../config/config.php';
header('Content-Type: application/json');

$pdo = getDB();

try {
    // Added p.id_number to the SELECT so it shows in your table
    $stmt = $pdo->prepare("
        SELECT u.id, u.name, u.email, p.id_front_path, p.id_back_path, p.kyc_status, p.id_number
        FROM users u 
        JOIN partner_about p ON u.id = p.user_id 
        WHERE p.kyc_status = 'pending'
    ");
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Wrap in a success object
    echo json_encode([
        "success" => true,
        "data" => $data
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false, 
        "message" => $e->getMessage()
    ]);
}