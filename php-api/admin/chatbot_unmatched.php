<?php
require_once '../config/origin.php';
require_once '../config/config.php';
header('Content-Type: application/json');
$pdo = getDB();

// Support JSON + POST
$data = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? $_POST['action'] ?? $data['action'] ?? '';

switch ($action) {

    case 'summary':

        $total = (int)$pdo->query("SELECT COUNT(*) FROM chatbot_stats")->fetchColumn();

        $matched = (int)$pdo->query("
            SELECT COUNT(*) FROM chatbot_stats 
            WHERE matched_keyword IS NOT NULL AND matched_keyword != ''
        ")->fetchColumn();

        $unmatched = (int)$pdo->query("
            SELECT COUNT(*) FROM chatbot_stats 
            WHERE matched_keyword IS NULL OR matched_keyword = ''
        ")->fetchColumn();

        $unique_users = (int)$pdo->query("
            SELECT COUNT(DISTINCT user_ip) FROM chatbot_stats
        ")->fetchColumn();

        $top_questions = $pdo->query("
            SELECT question, COUNT(*) as count 
            FROM chatbot_stats 
            GROUP BY question 
            ORDER BY count DESC 
            LIMIT 5
        ")->fetchAll();

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

    case 'list':

        $stmt = $pdo->query("
            SELECT id, question, user_ip, user_agent, created_at 
            FROM chatbot_stats 
            WHERE matched_keyword IS NULL OR matched_keyword = '' 
            ORDER BY created_at DESC 
            LIMIT 200
        ");

        sendResponse(200, $stmt->fetchAll());
        break;

    default:
        sendResponse(400, ['error' => 'Invalid action']);
}