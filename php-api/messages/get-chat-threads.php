<?php
// File: messages/get-chat-threads.php

require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

$pdo = getDB();

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "user_id is required"
    ]);
    exit;
}

try {

    /**
     * STEP 1: Get all chat partners (threads)
     */
    $stmt = $pdo->prepare("
        SELECT 
            CASE 
                WHEN sender_id = ? THEN recipient_id 
                ELSE sender_id 
            END AS chat_user_id,

            MAX(created_at) AS last_time

        FROM chat_messages
        WHERE sender_id = ? OR recipient_id = ?
        GROUP BY chat_user_id
        ORDER BY last_time DESC
    ");

    $stmt->execute([$user_id, $user_id, $user_id]);
    $threads = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $result = [];

    foreach ($threads as $thread) {

        $chat_user_id = $thread['chat_user_id'];

        /**
         * STEP 2: Get last message per thread
         */
        $msgStmt = $pdo->prepare("
            SELECT id, body, sender_id, recipient_id, created_at, status
            FROM chat_messages
            WHERE 
                (sender_id = ? AND recipient_id = ?)
                OR
                (sender_id = ? AND recipient_id = ?)
            ORDER BY created_at DESC
            LIMIT 1
        ");

        $msgStmt->execute([
            $user_id, $chat_user_id,
            $chat_user_id, $user_id
        ]);

        $lastMessage = $msgStmt->fetch(PDO::FETCH_ASSOC);

        /**
         * STEP 3: Unread count (based on status != read)
         */
        $unreadStmt = $pdo->prepare("
            SELECT COUNT(*) AS unread
            FROM chat_messages
            WHERE sender_id = ?
              AND recipient_id = ?
              AND status != 'read'
        ");

        $unreadStmt->execute([$chat_user_id, $user_id]);
        $unread = $unreadStmt->fetch(PDO::FETCH_ASSOC)['unread'];

        /**
         * STEP 4: Get user info
         */
        $userStmt = $pdo->prepare("
            SELECT id, name, role, image
            FROM users
            WHERE id = ?
            LIMIT 1
        ");

        $userStmt->execute([$chat_user_id]);
        $user = $userStmt->fetch(PDO::FETCH_ASSOC);

        $result[] = [
            "chat_user_id" => $chat_user_id,
            "name" => $user['role'] === 'partner'
                ? ($user['business_name'] ?: $user['name'])
                : $user['name'],
            "image" => $user['image'] ?? null,

            "last_message" => $lastMessage['body'] ?? '',
            "last_time" => $lastMessage['created_at'] ?? null,
            "status" => $lastMessage['status'] ?? 'sent',

            "unread" => (int)$unread
        ];
    }

    echo json_encode([
        "success" => true,
        "data" => $result
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ]);
}