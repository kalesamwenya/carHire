<?php
// API for sending chat messages only
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');
$pdo = getDB();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed. Use POST to send messages."]);
    exit;
}

// Handle both JSON and FormData inputs
$contentType = $_SERVER["CONTENT_TYPE"] ?? '';
if (strpos($contentType, 'application/json') !== false) {
    $data = json_decode(file_get_contents("php://input"), true);
} else {
    $data = $_POST;
}

// Basic validation and sanitization
$sender = isset($data['sender_id']) ? (int)$data['sender_id'] : null;
$recipient = isset($data['recipient_id']) ? (int)$data['recipient_id'] : null;
$body = isset($data['body']) ? trim($data['body']) : null;

// Ensure all required fields are present
if (!$sender || !$recipient || empty($body)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields or empty message"]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO chat_messages (sender_id, recipient_id, body, created_at) 
        VALUES (?, ?, ?, NOW())
    ");
    
    $result = $stmt->execute([$sender, $recipient, $body]);

    if ($result) {
        echo json_encode([
            "success" => true, 
            "message" => "Message sent!",
            "message_id" => $pdo->lastInsertId()
        ]);
    } else {
        throw new Exception("Failed to insert message into database.");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error sending message: " . $e->getMessage()]);
}