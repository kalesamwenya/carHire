<?php
// File: admin/mark_notifications_read.php

require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

$pdo = getDB();

/**
 * ONLY ALLOW POST
 */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Method not allowed"
    ]);

    exit;
}

try {

    /**
     * MARK ALL AS READ
     */
    $stmt = $pdo->prepare("
        UPDATE notifications
        SET 
            is_read = 1,
            read_at = NOW()
        WHERE is_read = 0
    ");

    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "All notifications marked as read"
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database Error",
        "error" => $e->getMessage()
    ]);
}