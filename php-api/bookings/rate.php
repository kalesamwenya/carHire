<?php
require_once '../config/origin.php';
require_once '../config/config.php';

$data = json_decode(file_get_contents("php://input"), true);
$bookingId = base64_decode($data['token'] ?? '');
$rating = $data['rating'] ?? null; // 1 to 5
$comment = $data['comment'] ?? '';

if (!$bookingId || !$rating) {
    http_response_code(400);
    echo json_encode(["message" => "Rating and valid token required."]);
    exit;
}

$pdo = getDB();

try {
    // Save to a 'reviews' table or update the 'bookings' table
    $stmt = $pdo->prepare("UPDATE bookings SET rating = ?, review_comment = ?, rated_at = NOW() WHERE id = ?");
    $stmt->execute([$rating, $comment, $bookingId]);

    echo json_encode(["message" => "Thank you for your feedback!"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error saving review."]);
}