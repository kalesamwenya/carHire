<?php
// File: api/admin/confirm-payment.php

require_once '../config/config.php';
header('Content-Type: application/json');

// Ensure only authorized admins can run this (Add your auth check here)

$booking_id = $_POST['booking_id'] ?? null;
$amount_received = $_POST['amount'] ?? null; 

if (!$booking_id || !$amount_received) {
    echo json_encode(["success" => false, "message" => "Missing booking ID or amount"]);
    exit;
}

$pdo = getDB();

try {
    $pdo->beginTransaction();

    // 1. Update the Booking Status
    $stmt = $pdo->prepare("
        UPDATE bookings 
        SET status = 'Confirmed', 
            payment_status = 'Paid' 
        WHERE booking_id = ?
    ");
    $stmt->execute([$booking_id]);

    // 2. Update the Payment Record
    $payStmt = $pdo->prepare("
        UPDATE payments 
        SET payment_status = 'Completed', 
            amount_paid = ?, 
            paid_at = CURRENT_TIMESTAMP 
        WHERE booking_id = ?
    ");
    $payStmt->execute([$amount_received, $booking_id]);

    $pdo->commit();

    echo json_encode(["success" => true, "message" => "Booking confirmed and paid!"]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}