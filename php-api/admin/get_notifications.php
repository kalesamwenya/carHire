<?php

require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

$pdo = getDB();

try {

    $stmt = $pdo->query("
        SELECT *
        FROM notifications
        ORDER BY created_at DESC
        LIMIT 20
    ");

    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $countStmt = $pdo->query("
        SELECT COUNT(*) 
        FROM notifications
        WHERE is_read = 0
    ");

    $unread = $countStmt->fetchColumn();

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