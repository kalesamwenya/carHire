<?php
// File: support/update_ticket_status.php

require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

    http_response_code(405);

    echo json_encode([
        "success" => false
    ]);

    exit;
}

$pdo = getDB();

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$id = $data['id'] ?? null;
$status = $data['status'] ?? 'Open';

if (!$id) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Ticket ID required"
    ]);

    exit;
}

try {

    $stmt = $pdo->prepare("
        UPDATE support_tickets
        SET
            status = :status,
            updated_at = NOW()
        WHERE id = :id
    ");

    $stmt->execute([
        ':status' => $status,
        ':id' => $id
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Ticket updated"
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}