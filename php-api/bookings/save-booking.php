<?php
// File: api/bookings/save-booking.php

require_once '../config/origin.php';
require_once '../config/config.php';
require_once '../config/EmailHelper.php';
require_once '../config/NotificationHelper.php';

header('Content-Type: application/json');

// Handle JSON input
$rawInput = file_get_contents('php://input');
$jsonData = json_decode($rawInput, true);

if ($jsonData) {
    $_POST = array_merge($_POST, $jsonData);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

// =======================
// 1. DATA COLLECTION
// =======================
$booking_id = $_POST['booking_id'] ?? null;
$ref_code   = $_POST['reference_code'] ?? null;
$car_id     = $_POST['car_id'] ?? null;

$cust_name  = $_POST['name'] ?? null;
$cust_email = $_POST['email'] ?? null;
$cust_phone = $_POST['phone'] ?? null;

$license    = $_POST['license'] ?? 'N/A';
$pickup     = $_POST['from'] ?? null;
$return     = $_POST['to'] ?? null;
$total      = $_POST['total_price'] ?? 0;

$visitor_id = $_POST['visitor_id'] ?? null;
$raw_user_id = $_POST['user_id'] ?? null;

// =======================
// 2. VALIDATION
// =======================
if (!$car_id || !$booking_id || !$cust_email || !$cust_phone) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields"
    ]);
    exit;
}

$pdo = getDB();

try {
    $pdo->beginTransaction();

    // =======================
    // 3. FETCH CAR DETAILS
    // =======================
    $carQuery = $pdo->prepare("
    SELECT name, partner_id 
    FROM cars 
    WHERE id = ? 
    LIMIT 1
");
    $carQuery->execute([$car_id]);
    $car_name = $carQuery->fetchColumn() ?: "CityDrive Vehicle";

    // =======================
    // 4. USER / VISITOR LOGIC (NEW)
    // =======================

    $user_id_value = null;
    $visitor_id_value = $visitor_id;

    if (!empty($cust_email)) {

        $checkUser = $pdo->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
        $checkUser->execute([$cust_email]);
        $existingUser = $checkUser->fetch(PDO::FETCH_ASSOC);

        if ($existingUser) {
            // EXISTING USER FOUND
            $user_id_value = $existingUser['id'];
            $visitor_id_value = null;
        } else {
            // NEW VISITOR
            if (!$visitor_id_value) {
                $visitor_id_value = 'VIS-' . strtoupper(uniqid()) . '-' . rand(1000, 9999);
            }
            $user_id_value = null;
        }
    }

    // =======================
    // 5. INSERT BOOKING
    // =======================
    $stmt = $pdo->prepare("
        INSERT INTO bookings (
            booking_id,
            reference_code,
            car_id,
            customer_name,
            customer_phone,
            customer_email,
            license_number,
            user_id,
            visitor_id,
            pickup_date,
            return_date,
            total_price,
            status,
            payment_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 'Unpaid')
    ");

    $stmt->execute([
        $booking_id,
        $ref_code,
        $car_id,
        $cust_name,
        $cust_phone,
        $cust_email,
        $license,
        $user_id_value,
        $visitor_id_value,
        $pickup,
        $return,
        $total
    ]);

    // =======================
    // 6. INSERT PAYMENT
    // =======================
    $payStmt = $pdo->prepare("
        INSERT INTO payments (
            booking_id,
            reference_code,
            amount_paid,
            payment_method,
            payment_status
        ) VALUES (?, ?, ?, 'Cash at Office', 'Pending')
    ");

    $payStmt->execute([$booking_id, $ref_code, $total]);

    $pdo->commit();

  NotificationHelper::create(
    $pdo,
    'New Booking Received',
    $cust_name . ' booked ' . $car_name . ' (Booking #' . $booking_id . ')',
    'success',
    $booking_id,
    'booking',
    $partner_id,   // 👈 THIS IS THE LINK
    null
);

    // =======================
    // 7. EMAIL NOTIFICATION
    // =======================
    EmailHelper::sendBookingPendingEmail(
        $cust_email,
        $cust_name,
        $car_name,
        $booking_id,
        $pickup,
        $total
    );

    // =======================
    // 8. RESPONSE
    // =======================
    echo json_encode([
        "success" => true,
        "message" => "Reservation saved successfully",
        "booking_id" => $booking_id,
        "user_id" => $user_id_value,
        "visitor_id" => $visitor_id_value
    ]);

} catch (Exception $e) {

    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database Error",
        "debug" => $e->getMessage()
    ]);
}