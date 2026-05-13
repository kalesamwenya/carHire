<?php

require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

$pdo = getDB();

$ticket_id = $_GET['ticket_id'] ?? '';

if (empty($ticket_id)) {

    echo json_encode([
        "success" => false,
        "message" => "Ticket ID required"
    ]);

    exit;
}

try {

    $stmt = $pdo->prepare("
        SELECT *
        FROM ticket_replies
        WHERE ticket_id = ?
        ORDER BY created_at ASC
    ");

    $stmt->execute([$ticket_id]);

    $replies = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $replies
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}