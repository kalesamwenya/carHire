<?php
require_once '../config/origin.php';
require_once '../config/config.php';
require_once '../config/EmailHelper.php'; // Important for the "Thank You" email

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $pdo = getDB();
        
        $booking_id = $_POST['booking_id'] ?? null;
        $name = $_POST['name'] ?? null;
        $rating = (int)($_POST['rating'] ?? 5);
        $text = $_POST['text'] ?? null;
        $role = $_POST['role'] ?? 'Verified Driver';

        if (!$booking_id || !$text) {
            throw new Exception("Missing required feedback information.");
        }

        // 1. Fetch the customer's email from the bookings table
        // This ensures the booking is real and gives us the email for the "Thank You" note
        $bookingQuery = $pdo->prepare("SELECT customer_email FROM bookings WHERE booking_id = ? LIMIT 1");
        $bookingQuery->execute([$booking_id]);
        $customer_email = $bookingQuery->fetchColumn();

        if (!$customer_email) {
            throw new Exception("Invalid Booking ID. Please check your receipt.");
        }

        // 2. Insert into testimonials table for moderation
        $stmt = $pdo->prepare("
            INSERT INTO testimonials (booking_id, user_name, user_role, rating, feedback_text, status)
            VALUES (?, ?, ?, ?, ?, 'pending')
        ");
        $stmt->execute([$booking_id, $name, $role, $rating, $text]);

        // 3. Send Branded "Thank You" Email
        // This uses the template we built in the EmailHelper
        EmailHelper::sendFeedbackThanksEmail($customer_email, $name, $rating);

        echo json_encode(['success' => true, 'message' => 'Thank you! Your review has been sent for approval.']);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
}