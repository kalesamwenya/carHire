<?php

/**
 * Partner Dashboard Records API
 * File: php-api/admin/get-partner-records.php
 */

require_once '../config/origin.php';
require_once '../config/config.php';

$pdo = getDB();

try {

    // =========================================
    // GET PARTNER ID
    // =========================================
    $partner_id = $_GET['partner_id'] ?? null;

    if (!$partner_id) {

        echo json_encode([
            "success" => false,
            "message" => "partner_id is required"
        ]);

        exit;
    }

    // =========================================
    // MASTER QUERY
    // =========================================
    $sql = "
        SELECT

            -- BOOKING
            b.id AS internal_id,
            b.booking_id,
            b.reference_code,
            b.customer_name,
            b.customer_email,
            b.customer_phone,
            b.pickup_date,
            b.return_date,
            b.total_price,
            b.status AS booking_status,
            b.payment_status,
            b.created_at,

            -- CAR
            c.id AS car_id,
            c.name AS vehicle_name,
            c.plate_number,
            c.featured_image,
            c.transmission,
            c.price_per_day,
            c.partner_id,

            -- PAYMENT
            p.amount_paid,
            p.transaction_code,
            p.payment_method,
            p.payment_status AS payment_verification,

            -- PARTNER
            u.name AS partner_name,
            u.email AS partner_email

        FROM bookings b

        INNER JOIN cars c
            ON b.car_id = c.id

        LEFT JOIN payments p
            ON b.booking_id = p.booking_id

        LEFT JOIN users u
            ON c.partner_id = u.id

        WHERE c.partner_id = :partner_id

        ORDER BY b.created_at DESC
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':partner_id' => $partner_id
    ]);

    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // =========================================
    // FORMAT DATA
    // =========================================
    $formatted = array_map(function ($row) {

        $quoted = (float) ($row['total_price'] ?? 0);
        $paid = (float) ($row['amount_paid'] ?? 0);

        $row['balance_due'] = $quoted - $paid;

        $row['is_fully_paid'] =
            $paid >= $quoted && $quoted > 0;

        $row['pickup_display'] =
            date('M d, Y', strtotime($row['pickup_date']));

        $row['return_display'] =
            date('M d, Y', strtotime($row['return_date']));

        return $row;

    }, $records);

    // =========================================
    // STATS
    // =========================================
    $total_earnings = 0;
    $active_rentals = 0;
    $total_vehicles = [];

    foreach ($formatted as $item) {

        $total_earnings +=
            (float) ($item['amount_paid'] ?? 0);

        if (
            in_array(
                strtolower($item['booking_status']),
                ['confirmed', 'upcoming', 'reserved']
            )
        ) {
            $active_rentals++;
        }

        $total_vehicles[$item['car_id']] = true;
    }

    echo json_encode([

        "success" => true,

        "stats" => [
            "total_earnings" => $total_earnings,
            "active_rentals" => $active_rentals,
            "total_vehicles" => count($total_vehicles)
        ],

        "count" => count($formatted),

        "data" => $formatted

    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}