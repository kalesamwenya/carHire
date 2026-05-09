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

        // 1. Fetch details including Partner and Payment info
        $query = $pdo->prepare("
            SELECT 
                b.*, 
                c.name as car_name,
                c.featured_image as car_image,
                u.email as partner_email, 
                u.name as partner_name,
                p.amount_paid
            FROM bookings b 
            JOIN cars c ON b.car_id = c.id 
            LEFT JOIN users u ON c.partner_id = u.id 
            LEFT JOIN payments p ON b.booking_id = p.booking_id
            WHERE b.id = ? 
            LIMIT 1
        ");
        $query->execute([$id]);
        $details = $query->fetch(PDO::FETCH_ASSOC);

        if (!$details) {
            throw new Exception("Booking record not found.");
        }

        $refundAmount = 0;
        $retainedAmount = (float)($details['amount_paid'] ?? 0);

        // 2. Cancellation Logic & Payment Updates
        if ($newStatus === 'cancelled' || $newStatus === 'refunded') {
            $pickupDate = new DateTime($details['pickup_date']);
            $now = new DateTime();
            $interval = $now->diff($pickupDate);
            
            // Calculate hours remaining (check invert to handle past dates)
            $hoursRemaining = ($interval->invert) ? 0 : ($interval->days * 24) + $interval->h;
            $totalPaid = (float)$details['amount_paid'];

            if ($hoursRemaining < 24) {
                $retainedAmount = $totalPaid * 0.50; // Keep 50%
                $refundAmount = $totalPaid * 0.50;
            } elseif ($hoursRemaining < 48) {
                $retainedAmount = $totalPaid * 0.20; // Keep 20%
                $refundAmount = $totalPaid * 0.80;
            } else {
                $retainedAmount = 0; // Full Refund
                $refundAmount = $totalPaid;
            }

            // Update payment to reflect retained amount (revenue kept)
            $payStmt = $pdo->prepare("UPDATE payments SET payment_status = 'Failed', amount_paid = ? WHERE booking_id = ?");
            $payStmt->execute([$retainedAmount, $details['booking_id']]);
        } else {
            // Standard Status Mapping
            $paymentStatus = in_array($newStatus, ['confirmed', 'completed']) ? 'Verified' : 'Pending';
            $payStmt = $pdo->prepare("
                UPDATE payments 
                SET payment_status = ?, 
                    paid_at = CASE WHEN ? = 'Verified' AND paid_at IS NULL THEN CURRENT_TIMESTAMP ELSE paid_at END
                WHERE booking_id = ?
            ");
            $payStmt->execute([$paymentStatus, $paymentStatus, $details['booking_id']]);
        }

        // 3. Update Booking Table
        $stmt = $pdo->prepare("UPDATE bookings SET status = ? WHERE id = ?");
        $stmt->execute([$newStatus, $id]);

        $pdo->commit();

        // 4. Trigger Branded Emails
        if ($details && isset($details['customer_email'])) {
            try {
                if ($newStatus === 'confirmed') {
                    EmailHelper::sendBookingConfirmedEmail(
                        $details['customer_email'], $details['customer_name'], $details['car_name'], 
                        $details['booking_id'], $details['pickup_date'], $details['total_price']
                    );

                    if (!empty($details['partner_email'])) {
                        EmailHelper::sendPartnerAlert(
                            $details['partner_email'], $details['partner_name'] ?? 'Partner', 
                            $details['car_name'], $details['booking_id'], $details['customer_name'], $details['total_price']
                        );
                    }
                } 
                elseif ($newStatus === 'completed') {
                    EmailHelper::sendFeedbackRequestEmail(
                        $details['customer_email'], $details['customer_name'], $details['car_name'], 
                        $details['booking_id'], $details['car_image']
                    );
                } 
                elseif ($newStatus === 'cancelled' || $newStatus === 'refunded') {
                    // Optimized to send the Refund breakdown email
                    EmailHelper::sendRefundProcessedEmail(
                        $details['customer_email'], $details['customer_name'], 
                        $details['booking_id'], $refundAmount, $retainedAmount
                    );
                }
            } catch (Exception $e) {
                error_log("CityDrive Email Error: " . $e->getMessage());
            }
        }

        echo json_encode([
            "status" => "success", 
            "message" => "Booking " . $details['booking_id'] . " updated.",
            "meta" => ["refund" => $refundAmount, "retained" => $retainedAmount]
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