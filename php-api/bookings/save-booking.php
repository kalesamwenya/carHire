<?php
// File: api/bookings/save-booking.php

require_once '../config/origin.php';
require_once '../config/config.php';
require_once '../config/EmailHelper.php';

header('Content-Type: application/json');

// Handle JSON input from Next.js fetch / Axios
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

// 1. Data Collection
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

// 2. Logic: Handle Foreign Key for User ID
// If user is not logged in, we MUST pass NULL to the database, not the string 'guest'
$raw_user_id = $_POST['user_id'] ?? 'guest';
$user_id_value = ($raw_user_id === 'guest' || empty($raw_user_id)) ? null : $raw_user_id;

// 3. Validation
if (!$car_id || !$booking_id || !$cust_email || !$cust_phone) {
    http_response_code(400);
    echo json_encode([
        "success" => false, 
        "message" => "Missing required fields",
        "debug" => [
            "car_id" => !!$car_id,
            "booking_id" => !!$booking_id,
            "email" => !!$cust_email,
            "phone" => !!$cust_phone
        ]
    ]);
    exit;
}

$pdo = getDB();

try {
    $pdo->beginTransaction();

    /* --- STEP A: FETCH CAR NAME --- */
    // Using 'name' column based on previous error fix
    $carQuery = $pdo->prepare("SELECT name FROM cars WHERE id = ? LIMIT 1");
    $carQuery->execute([$car_id]);
    $car_name = $carQuery->fetchColumn() ?: "CityDrive Vehicle";

    /* --- STEP B: INSERT BOOKING --- */
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
        $user_id_value, // Correctly passing NULL or valid INT
        $visitor_id,
        $pickup,
        $return,
        $total
    ]);

    /* --- STEP C: INSERT PAYMENT RECORD --- */
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

    /* --- STEP D: TRIGGER BRANDED EMAIL --- */
    // Note: Added $car_name to the helper call
    EmailHelper::sendBookingPendingEmail(
        $cust_email, 
        $cust_name, 
        $car_name, 
        $booking_id, 
        $pickup, 
        $total
    );

    echo json_encode([
        "success" => true, 
        "message" => "Reservation saved successfully",
        "booking_id" => $booking_id
    ]);

} catch (Exception $e) {
    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Database Error: " . $e->getMessage()
    ]);
}