<?php
// API for admin-partner direct chat
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');
$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Force integer casting to avoid string vs int mismatches
    $sender_id = isset($_GET['sender_id']) ? (int)$_GET['sender_id'] : null;
    $recipient_id = isset($_GET['recipient_id']) ? (int)$_GET['recipient_id'] : null;

    if (!$sender_id || !$recipient_id) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Missing IDs", "debug" => $_GET]);
        exit;
    }

    try {
        // Fetch bidirectional history
        $stmt = $pdo->prepare("
            SELECT * FROM chat_messages 
            WHERE (sender_id = ? AND recipient_id = ?) 
            OR (sender_id = ? AND recipient_id = ?) 
            ORDER BY created_at ASC
        ");
        $stmt->execute([$sender_id, $recipient_id, $recipient_id, $sender_id]);
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // AUTO-MARK AS READ: If I am fetching these, I am seeing them.
        $update = $pdo->prepare("UPDATE chat_messages SET status = 'read' WHERE recipient_id = ? AND sender_id = ?");
        $update->execute([$sender_id, $recipient_id]);

        echo json_encode(["success" => true, "data" => $messages]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database error"]);
    }

} else if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $sender = isset($data['sender_id']) ? (int)$data['sender_id'] : null;
    $recipient = isset($data['recipient_id']) ? (int)$data['recipient_id'] : null;
    $body = isset($data['body']) ? trim($data['body']) : null;

    if (!$sender || !$recipient || empty($body)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Required fields missing"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO chat_messages (sender_id, recipient_id, body, status, created_at) VALUES (?, ?, ?, 'unread', NOW())");
        $stmt->execute([$sender, $recipient, $body]);

        echo json_encode([
            "success" => true, 
            "id" => $pdo->lastInsertId() 
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Save failed"]);
    }
}