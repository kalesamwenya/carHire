<?php
/**
 * Master API for CityDrive Hire - Combined Records View
 */
require_once '../config/origin.php'; // Handles CORS & JSON headers
require_once '../config/config.php';

$pdo = getDB();

try {
    /**
     * THE MASTER QUERY
     * Joins Bookings (b), Cars (c), Users (u), and Payments (p)
     */
    $sql = "SELECT 
                -- Booking Basics
                b.id AS internal_id,
                b.booking_id AS reference_no,
                b.customer_name,
                b.pickup_date,
                b.return_date,
                b.license_number AS license,
                b.total_price AS quoted_amount,
                b.status AS booking_status,
                b.created_at AS booked_on,

                -- Car Details
                c.name AS vehicle_name,
                c.plate_number,
                c.featured_image AS vehicle_thumbnail,
                c.transmission,

                -- Customer Details (from users table)
                u.email AS customer_email,
                u.phone AS customer_phone,
                u.residency,

                -- Payment Details (if exists)
                COALESCE(p.amount_paid, 0) AS total_paid,
                p.transaction_code,
                p.payment_status,
                p.payment_method
                
            FROM bookings b
            INNER JOIN cars c ON b.car_id = c.id
            LEFT JOIN users u ON b.user_id = u.id OR b.customer_email = u.email
            LEFT JOIN payments p ON b.booking_id = p.booking_id
            ORDER BY b.created_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Process records for frontend convenience
    $formattedRecords = array_map(function($row) {
        $quoted = (float)$row['quoted_amount'];
        $paid = (float)$row['total_paid'];
        
        // Add calculated fields
        $row['balance_due'] = $quoted - $paid;
        $row['is_fully_paid'] = ($paid >= $quoted && $quoted > 0);
        
        // Clean up display dates
        $row['pickup_display'] = date('M d, Y', strtotime($row['pickup_date']));
        $row['return_display'] = date('M d, Y', strtotime($row['return_date']));
        
        return $row;
    }, $records);

    echo json_encode([
        "success" => true,
        "count" => count($formattedRecords),
        "data" => $formattedRecords
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database Error: " . $e->getMessage()
    ]);
}