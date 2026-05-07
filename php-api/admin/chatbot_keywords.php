<?php
require_once '../config/origin.php';
require_once '../config/config.php';
header('Content-Type: application/json');
try {
    $pdo = getDB();
} catch (Exception $e) {
    sendResponse(500, ['error' => $e->getMessage()]);
}

$data = json_decode(file_get_contents('php://input'), true);
$action = $_GET['action'] ?? $_POST['action'] ?? $data['action'] ?? '';

switch ($action) {

    case 'list':
        $stmt = $pdo->query("SELECT * FROM chatbot_keywords ORDER BY priority DESC, id DESC");
        sendResponse(200, $stmt->fetchAll());
        break;

    case 'add':

        $intent = trim($data['intent'] ?? $_POST['intent'] ?? '');
        $keywords = $data['keywords'] ?? $_POST['keywords'] ?? '';
        $answer = trim($data['answer'] ?? $_POST['answer'] ?? '');
        $followUp = $data['follow_up'] ?? $_POST['follow_up'] ?? null;
        $priority = (int)($data['priority'] ?? $_POST['priority'] ?? 1);
        $actions = $data['action_links'] ?? $_POST['action_links'] ?? null;

        if (!$intent || !$keywords || !$answer) {
            sendResponse(400, ['error' => 'Missing required fields']);
        }

        if (is_array($keywords)) {
            $keywords = implode(',', array_map('trim', $keywords));
        } else {
            $keywords = implode(',', array_map('trim', explode(',', strtolower($keywords))));
        }

        $stmt = $pdo->prepare("
            INSERT INTO chatbot_keywords
            (intent, keywords, answer, follow_up, action_links, priority)
            VALUES (?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            strtolower($intent),
            $keywords,
            $answer,
            $followUp,
            $actions ? json_encode($actions) : null,
            $priority
        ]);

        sendResponse(200, ['success' => true]);
        break;

    case 'update':

        $id = (int)($data['id'] ?? $_POST['id'] ?? 0);
        $intent = trim($data['intent'] ?? $_POST['intent'] ?? '');
        $keywords = $data['keywords'] ?? $_POST['keywords'] ?? '';
        $answer = trim($data['answer'] ?? $_POST['answer'] ?? '');
        $followUp = $data['follow_up'] ?? $_POST['follow_up'] ?? null;
        $priority = (int)($data['priority'] ?? $_POST['priority'] ?? 1);
        $actions = $data['action_links'] ?? $_POST['action_links'] ?? null;

        if (!$id || !$intent || !$keywords || !$answer) {
            sendResponse(400, ['error' => 'Missing required fields']);
        }

        if (is_array($keywords)) {
            $keywords = implode(',', array_map('trim', $keywords));
        } else {
            $keywords = implode(',', array_map('trim', explode(',', strtolower($keywords))));
        }

        $stmt = $pdo->prepare("
            UPDATE chatbot_keywords
            SET intent=?, keywords=?, answer=?, follow_up=?, action_links=?, priority=?
            WHERE id=?
        ");

        $stmt->execute([
            strtolower($intent),
            $keywords,
            $answer,
            $followUp,
            $actions ? json_encode($actions) : null,
            $priority,
            $id
        ]);

        sendResponse(200, ['success' => true]);
        break;

    case 'delete':
        $id = (int)($_POST['id'] ?? $data['id'] ?? 0);

        if (!$id) {
            sendResponse(400, ['error' => 'Missing id']);
        }

        $stmt = $pdo->prepare("DELETE FROM chatbot_keywords WHERE id=?");
        $stmt->execute([$id]);

        sendResponse(200, ['success' => true]);
        break;

    default:
        sendResponse(400, ['error' => 'Invalid action']);
}