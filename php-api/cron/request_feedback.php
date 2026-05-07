<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/EmailHelper.php';

$pdo = getDB();

// 1. Find bookings that ended yesterday and haven't been rated yet
$sql = "SELECT b.id, b.email, b.name, c.name as car_name 
        FROM bookings b
        JOIN cars c ON b.car_id = c.id
        WHERE DATE(b.end_date) = SUBDATE(CURDATE(), 1)
        AND b.status = 'completed'";

$stmt = $pdo->query($sql);
$bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($bookings as $booking) {
    // We use a base64 encoded ID to make the URL look cleaner
    $token = base64_encode($booking['id']);
    $reviewLink = "https://citydrivehire.com/rate/" . $token;
    
    $subject = "How was your ride, {$booking['name']}?";

    $to = $booking['email'];
    
    $content = "
        <h2 style='color: #0f172a; margin-top: 0;'>Thank you for choosing CityDrive!</h2>
        <p>Hi <strong>{$booking['name']}</strong>,</p>
        <p>Your rental for the <strong>{$booking['car_name']}</strong> ended yesterday. We'd love to hear about your experience to ensure we keep providing the best service in Zambia.</p>
        
        <div style='text-align: center; margin: 40px 0;'>
            <a href='$reviewLink' style='background-color: #16a34a; color: white; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;'>
                Rate Your Experience
            </a>
        </div>
        
        <p style='font-size: 14px; color: #64748b; text-align: center;'>It only takes 30 seconds!</p>
    ";
    
    // Use your existing EmailHelper
    EmailHelper::sendBrandedEmail($to, $subject, $content);
}