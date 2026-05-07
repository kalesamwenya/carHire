<?php
// api/admin/chatbot_unmatched.php

require_once '../config/origin.php';
require_once '../config/config.php';
header('Content-Type: application/json');
// Connect DB safely
try {
   $pdo = getDB();
} catch (Exception $e) {
    sendResponse(500, ['error' => $e->getMessage()]);
}

// Support JSON + POST + GET
$data = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? $_POST['action'] ?? $data['action'] ?? '';

switch ($action) {

    case 'summary':

        // Total interactions
        $total = (int)$pdo->query("
            SELECT COUNT(*) FROM chatbot_stats
        ")->fetchColumn();

        // Matched answers
        $matched = (int)$pdo->query("
            SELECT COUNT(*) FROM chatbot_stats 
            WHERE matched_keyword IS NOT NULL AND matched_keyword != ''
        ")->fetchColumn();

        // Unmatched
        $unmatched = (int)$pdo->query("
            SELECT COUNT(*) FROM chatbot_stats 
            WHERE matched_keyword IS NULL OR matched_keyword = ''
        ")->fetchColumn();

        // Unique users
        $unique_users = (int)$pdo->query("
            SELECT COUNT(DISTINCT user_ip) FROM chatbot_stats
        ")->fetchColumn();

        // Top questions
        $top_questions = $pdo->query("
            SELECT question, COUNT(*) as count 
            FROM chatbot_stats 
            GROUP BY question 
            ORDER BY count DESC 
            LIMIT 5
        ")->fetchAll();

        // Top keywords
        $top_keywords = $pdo->query("
            SELECT matched_keyword, COUNT(*) as count 
            FROM chatbot_stats 
            WHERE matched_keyword IS NOT NULL AND matched_keyword != ''
            GROUP BY matched_keyword 
            ORDER BY count DESC 
            LIMIT 5
        ")->fetchAll();

        sendResponse(200, [
            'total' => $total,
            'matched' => $matched,
            'unmatched' => $unmatched,
            'unique_users' => $unique_users,
            'top_questions' => $top_questions,
            'top_keywords' => $top_keywords
        ]);
        break;

    default:
        sendResponse(400, [
            'success' => false,
            'error' => 'Invalid action'
        ]);
}