<?php
// File: get_tax_reports.php
require_once '../config/origin.php';
require_once '../config/config.php';
header('Content-Type: application/json');


$pdo = getDB();

try {
    // We only calculate tax on 'Verified' payments
    $query = "
        SELECT 
            DATE_FORMAT(p.paid_at, '%M %Y') as month_name,
            SUM(p.amount_paid) as total_revenue,
            COUNT(p.id) as payment_count,
            (SUM(p.amount_paid) * 0.04) as turnover_tax,
            (SUM(p.amount_paid) * 0.16) as vat_amount
        FROM payments p
        JOIN bookings b ON p.booking_id = b.booking_id
        WHERE p.payment_status = 'Verified'
        GROUP BY month_name
        ORDER BY p.paid_at DESC
    ";

    $stmt = $pdo->query($query);
    $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $reports
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}