<?php
// File: api/cron/auto_status_updater.php

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/EmailHelper.php';

// Security: Use a secret key so random people can't trigger your cron
$secret_key = "CityDrive_Auto_2026_x92pL";
if (($_GET['key'] ?? '') !== $secret_key) {
    die("Unauthorized");
}

$pdo = getDB();
$now = date('Y-m-d H:i:s');

try {
    /* 
       PHASE 1: AUTO-COMPLETE BOOKINGS
       Find "Confirmed" bookings where the return_date has passed.
    */
    $query = $pdo->prepare("
        SELECT b.id, b.booking_id, b.customer_name, b.customer_email, c.name as car_name, c.image_url as car_image
        FROM bookings b
        JOIN cars c ON b.car_id = c.id
        WHERE b.status = 'confirmed' 
        AND b.return_date <= ?
    ");
    $query->execute([$now]);
    $toComplete = $query->fetchAll(PDO::FETCH_ASSOC);

    foreach ($toComplete as $booking) {
        // Update DB
        $update = $pdo->prepare("UPDATE bookings SET status = 'completed', updated_at = NOW() WHERE id = ?");
        $update->execute([$booking['id']]);

        // Send Feedback Request Email (The Branded one with the car image)
        EmailHelper::sendFeedbackRequestEmail(
            $booking['customer_email'],
            $booking['customer_name'],
            $booking['car_name'],
            $booking['booking_id'],
            $booking['car_image']
        );
    }

    echo "Automation complete. Total bookings updated: " . count($toComplete);

} catch (Exception $e) {
    error_log("Cron Error: " . $e->getMessage());
}