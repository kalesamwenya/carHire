<?php
/**
 * File: support/reply_message.php
 */

require_once '../config/origin.php';
require_once '../config/config.php';
// Ensure your EmailHelper class is loaded
require_once '../config/EmailHelper.php'; 

header('Content-Type: application/json');

$pdo = getDB();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data['email'] ?? '');
$subject = trim($data['subject'] ?? '');
$message = trim($data['message'] ?? '');
$admin_name = trim($data['admin_name'] ?? 'CityDrive Support');

if (empty($email) || empty($subject) || empty($message)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Required fields missing"]);
    exit;
}

try {
    // 1. SAVE REPLY TO DATABASE
    $stmt = $pdo->prepare("
        INSERT INTO messages (name, email, subject, message, status, created_at)
        VALUES (:name, :email, :subject, :message, 'replied', NOW())
    ");

    $stmt->execute([
        ':name'    => $admin_name,
        ':email'   => $email,
        ':subject' => $subject,
        ':message' => $message
    ]);

    // 2. MARK PREVIOUS MESSAGES FROM THIS USER AS READ
    $update = $pdo->prepare("
        UPDATE messages
        SET status = 'read'
        WHERE email = :email AND status = 'unread'
    ");
    $update->execute([':email' => $email]);

    // 3. SEND THE EMAIL
    // Matches Definition: sendSupportReply($toEmail, $customerName, $subject, $replyMessage)
    $emailSent = EmailHelper::sendSupportReply(
        $email,         // $toEmail
        "Customer",     // $customerName (Placeholder or fetch from DB)
        $subject,       // $subject
        $message        // $replyMessage
    );

    if ($emailSent) {
        echo json_encode([
            "success" => true,
            "message" => "Reply saved and email sent successfully"
        ]);
    } else {
        // Log this internally if possible
        echo json_encode([
            "success" => true,
            "message" => "Reply saved, but email failed to send. Check mail logs."
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database Error: " . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}