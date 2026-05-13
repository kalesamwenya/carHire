<?php

require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

$pdo = getDB();

/**
 * Partner ID from request
 */
$partnerId = $_GET['partner_id'] ?? null;

if (!$partnerId) {
    echo json_encode([
        "success" => false,
        "message" => "Partner ID required"
    ]);
    exit;
}

try {

    // =========================
    // 1. GET PARTNER NOTIFICATIONS
    // =========================
    $stmt = $pdo->prepare("
        SELECT *
        FROM notifications
        WHERE partner_id = ?
        ORDER BY created_at DESC
        LIMIT 20
    ");

    $stmt->execute([$partnerId]);

    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // =========================
    // 2. UNREAD COUNT (PARTNER ONLY)
    // =========================
    $countStmt = $pdo->prepare("
        SELECT COUNT(*) 
        FROM notifications
        WHERE is_read = 0
        AND partner_id = ?
    ");

    $countStmt->execute([$partnerId]);

    $unread = $countStmt->fetchColumn();

    // =========================
    // 3. RESPONSE
    // =========================
    echo json_encode([
        "success" => true,
        "data" => $notifications,
        "unread" => (int)$unread
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}