<?php
// File: admin/manage_feedback.php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

try {
    $pdo = getDB();
    $method = $_SERVER['REQUEST_METHOD'];

    // GET: Fetch all pending or recent reviews
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT id, booking_id, user_name, user_role, rating, feedback_text, status, created_at FROM testimonials ORDER BY created_at DESC");
        $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $reviews]);
    }

    // POST: Update status or delete
    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        $action = $input['action'] ?? null; // 'approve' or 'delete'

        if (!$id || !$action) throw new Exception("Invalid request.");

        if ($action === 'approve') {
            $stmt = $pdo->prepare("UPDATE testimonials SET status = 'approved' WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'Review approved.']);
        } 
        elseif ($action === 'delete') {
            $stmt = $pdo->prepare("DELETE FROM testimonials WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'Review deleted.']);
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}