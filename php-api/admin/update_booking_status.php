<?php
// File: admin/update_booking_status.php

require_once '../config/origin.php';
require_once '../config/config.php';
require_once '../config/EmailHelper.php';

header('Content-Type: application/json');

$pdo = getDB();

$input = json_decode(file_get_contents('php://input'), true);

$id = $input['id'] ?? null; 
$newStatus = $input['status'] ?? null;

$validStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'refunded'];

if ($id && in_array($newStatus, $validStatuses)) {
    try {
        $pdo->beginTransaction();

        // 1. Fetch details including Partner information
        // We join 'cars' and potentially a 'users' table to get the owner/partner email
        $query = $pdo->prepare("
    SELECT 
        b.id,
        b.booking_id, 
        b.customer_name, 
        b.customer_email, 
        b.pickup_date, 
        b.total_price, 
        c.name as car_name,
        c.featured_image as car_image,
        u.email as partner_email, 
        u.name as partner_name
    FROM bookings b 
    JOIN cars c ON b.car_id = c.id 
    LEFT JOIN users u ON c.partner_id = u.id 
    WHERE b.id = ? 
    LIMIT 1
");
$query->execute([$id]);
$details = $query->fetch(PDO::FETCH_ASSOC);
        if (!$details) {
            throw new Exception("Booking record not found.");
        }

        // 2. Perform the Status Update
        $stmt = $pdo->prepare("UPDATE bookings SET status = ? WHERE id = ?");
        $stmt->execute([$newStatus, $id]);

        $pdo->commit();

        // 3. Trigger Branded Emails
        if ($details && isset($details['customer_email'])) {
            try {
                if ($newStatus === 'confirmed') {
                    // Send to Customer
                    EmailHelper::sendBookingConfirmedEmail(
                        $details['customer_email'],
                        $details['customer_name'],
                        $details['car_name'],
                        $details['booking_id'],
                        $details['pickup_date'],
                        $details['total_price']
                    );

                    // Send to Partner/Car Owner
                    if (!empty($details['partner_email'])) {
                        EmailHelper::sendPartnerAlert(
                            $details['partner_email'],
                            $details['partner_name'] ?? 'Partner',
                            $details['car_name'],
                            $details['booking_id'],
                            $details['customer_name'],
                            $details['total_price']
                        );
                    }
                } 
                elseif ($newStatus === 'completed') {
                    EmailHelper::sendFeedbackRequestEmail(
                        $details['customer_email'],
                        $details['customer_name'],
                        $details['car_name'],
                        $details['booking_id'],
                        $details['car_image']
                    );
                } 
                elseif ($newStatus === 'cancelled') {
                    EmailHelper::sendBookingCancelledEmail(
                        $details['customer_email'],
                        $details['customer_name'],
                        $details['car_name'],
                        $details['booking_id']
                    );
                }
            } catch (Exception $e) {
                error_log("CityDrive Email Error: " . $e->getMessage());
            }
        }

        echo json_encode([
            "status" => "success", 
            "message" => "Booking " . $details['booking_id'] . " successfully set to " . ucfirst($newStatus)
        ]);

    } catch (Exception $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid ID or Status provided."]);
}