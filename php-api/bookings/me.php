<?php
// File: bookings/me.php

require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

$pdo = getDB();

/*
|--------------------------------------------------------------------------
| INPUTS
|--------------------------------------------------------------------------
*/
$userId = $_GET['user_id'] ?? null;
$email = $_GET['email'] ?? null;
$visitorId = $_GET['visitor_id'] ?? null;

/*
|--------------------------------------------------------------------------
| VALIDATION
|--------------------------------------------------------------------------
*/
if (!$userId && !$email && !$visitorId) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "User ID, email or visitor ID required"
    ]);

    exit;
}

try {

    /*
    |--------------------------------------------------------------------------
    | BASE QUERY
    |--------------------------------------------------------------------------
    */
    $query = "
        SELECT
            /* BOOKING DATA */
            b.id AS internal_id,
            b.booking_id,
            b.reference_code AS booking_ref,
            b.pickup_date,
            b.return_date,
            b.total_price AS quoted_price,
            b.status AS booking_status,
            b.payment_status,
            b.created_at,

            /* CUSTOMER */
            b.customer_name,
            b.customer_email,
            b.customer_phone,

            /* CAR DATA */
            c.id AS car_id,
            c.name AS car_name,
            c.type AS car_type,
            c.plate_number,
            c.featured_image AS image_cover,
            c.transmission,
            c.fuel AS fuel_type,
            c.seats,
            c.color,

            /* CAR IMAGE */
            i.image_url AS car_image,

            /* PAYMENT */
            p.transaction_code,
            p.amount_paid,
            p.payment_method,
            p.payment_status AS payment_record_status,
            p.receipt_path,
            p.paid_at

        FROM bookings b

        INNER JOIN cars c
            ON b.car_id = c.id

        LEFT JOIN (
            SELECT car_id, MIN(image_url) AS image_url
            FROM car_images
            GROUP BY car_id
        ) i
            ON c.id = i.car_id

        LEFT JOIN payments p
            ON b.booking_id = p.booking_id
    ";

    /*
    |--------------------------------------------------------------------------
    | DYNAMIC WHERE
    |--------------------------------------------------------------------------
    */
    $conditions = [];
    $params = [];

    // Logged in users
    if ($userId) {
        $conditions[] = "b.user_id = ?";
        $params[] = $userId;
    }

    // Guest bookings by email
    if ($email) {
        $conditions[] = "b.customer_email = ?";
        $params[] = $email;
    }

    // Guest visitor tracking
    if ($visitorId) {
        $conditions[] = "b.visitor_id = ?";
        $params[] = $visitorId;
    }

    if (!empty($conditions)) {
        $query .= " WHERE (" . implode(" OR ", $conditions) . ")";
    }

    /*
    |--------------------------------------------------------------------------
    | ORDERING
    |--------------------------------------------------------------------------
    */
    $query .= " ORDER BY b.created_at DESC";

    /*
    |--------------------------------------------------------------------------
    | EXECUTE
    |--------------------------------------------------------------------------
    */
    $stmt = $pdo->prepare($query);

    $stmt->execute($params);

    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    /*
    |--------------------------------------------------------------------------
    | RESPONSE
    |--------------------------------------------------------------------------
    */
    echo json_encode([
        "success" => true,
        "count" => count($bookings),
        "data" => $bookings
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}