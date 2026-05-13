<?php
// File: support/create_ticket.php

require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Method not allowed"
    ]);

    exit;
}

$pdo = getDB();

$data = json_decode(
    file_get_contents("php://input"),
    true
);

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$phone = trim($data['phone'] ?? '');
$subject = trim($data['subject'] ?? '');
$message = trim($data['message'] ?? '');
$priority = trim($data['priority'] ?? 'Medium');
$booking_id = trim($data['booking_id'] ?? '');

if (
    empty($name) ||
    empty($email) ||
    empty($subject) ||
    empty($message)
) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Required fields missing"
    ]);

    exit;
}

try {

    $ticket_id =
        'TKT-' .
        strtoupper(substr(uniqid(), -6));

    $stmt = $pdo->prepare("
        INSERT INTO support_tickets (
            ticket_id,
            booking_id,
            customer_name,
            customer_email,
            customer_phone,
            subject,
            message,
            priority,
            status,
            created_at
        )
        VALUES (
            :ticket_id,
            :booking_id,
            :customer_name,
            :customer_email,
            :customer_phone,
            :subject,
            :message,
            :priority,
            'Open',
            NOW()
        )
    ");

    $stmt->execute([
        ':ticket_id' => $ticket_id,
        ':booking_id' => $booking_id,
        ':customer_name' => $name,
        ':customer_email' => $email,
        ':customer_phone' => $phone,
        ':subject' => $subject,
        ':message' => $message,
        ':priority' => $priority
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Support ticket submitted",
        "ticket_id" => $ticket_id
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}