<?php

require_once '../config/origin.php';
require_once '../config/config.php';
require_once '../config/EmailHelper.php';

header('Content-Type: application/json');

$pdo = getDB();

$data = json_decode(file_get_contents("php://input"), true);

$ticket_id = trim($data['ticket_id'] ?? '');
$email = trim($data['email'] ?? '');
$subject = trim($data['subject'] ?? '');
$message = trim($data['message'] ?? '');
$customer_name = trim($data['customer_name'] ?? '');

if (
    empty($ticket_id) ||
    empty($email) ||
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

    $pdo->beginTransaction();

    /**
     * SAVE REPLY
     */

    $reply = $pdo->prepare("
        INSERT INTO ticket_replies (
            ticket_id,
            sender,
            sender_name,
            sender_email,
            message
        )
        VALUES (?, 'admin', 'CityDrive Support', ?, ?)
    ");

    $reply->execute([
        $ticket_id,
        $email,
        $message
    ]);

    /**
     * UPDATE TICKET STATUS
     */

    $update = $pdo->prepare("
        UPDATE support_tickets
        SET status = 'In Progress'
        WHERE ticket_id = ?
    ");

    $update->execute([$ticket_id]);

    $pdo->commit();

    /**
     * SEND EMAIL
     */

    EmailHelper::sendHelpSupportReplyEmail(
        $email,
        $customer_name,
        $ticket_id,
        $subject,
        $message
    );

    echo json_encode([
        "success" => true,
        "message" => "Reply sent successfully"
    ]);

} catch (Exception $e) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}