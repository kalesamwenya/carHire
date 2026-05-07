<?php
// File: admin/contact_messages.php
require_once '../config/origin.php'; 
require_once '../config/config.php'; 

header('Content-Type: application/json');
$pdo = getDB();

$method = $_SERVER['REQUEST_METHOD'];

// 1. FETCH MESSAGES FOR ADMIN (GET)
if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM messages ORDER BY created_at DESC");
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["success" => true, "data" => $messages]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
} 

// 2. SAVE NEW CONTACT MESSAGE (POST)
else if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (empty($data['name']) || empty($data['email']) || empty($data['subject']) || empty($data['message'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Required fields missing"]);
        exit;
    }

    try {
        $ip = $_SERVER['REMOTE_ADDR'];
        $stmt = $pdo->prepare("
            INSERT INTO messages (name, email, subject, message, ip_address, created_at) 
            VALUES (?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([
            $data['name'], 
            $data['email'], 
            $data['subject'], 
            $data['message'],
            $ip
        ]);

        echo json_encode(["success" => true, "message" => "Message received. We'll be in touch!"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }
}

// 3. UPDATE MESSAGE STATUS (PUT)
else if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? null;
    $status = $data['status'] ?? 'read';

    if (!$id) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "ID required"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE messages SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);
        echo json_encode(["success" => true, "message" => "Message marked as " . $status]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}

// 4. DELETE MESSAGE (DELETE)
else if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "ID required"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM messages WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true, "message" => "Message deleted"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}