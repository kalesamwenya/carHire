<?php
require_once '../config/origin.php';
require_once '../config/config.php';
$pdo = getDB();

header('Content-Type: application/json');

try {
    // We aggregate payment data to show what's actually been collected vs the total price
    $sql = "SELECT 
                b.id, 
                b.booking_id, 
                b.customer_name, 
                b.pickup_date, 
                b.total_price, 
                b.status AS booking_status,
                COALESCE(SUM(p.amount_paid), 0) AS total_paid
            FROM bookings b
            LEFT JOIN payments p ON b.id = p.booking_id
            WHERE b.status IN ('confirmed', 'completed', 'refunded')
            GROUP BY b.id
            ORDER BY b.pickup_date DESC";

    $stmt = $pdo->query($sql);
    
    $invoices = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $totalPrice = (float)$row['total_price'];
        $totalPaid = (float)$row['total_paid'];
        
        // Determine Financial Status for the UI
        $financialStatus = 'Pending';
        if ($totalPaid >= $totalPrice) {
            $financialStatus = 'Paid';
        } elseif ($totalPaid > 0) {
            $financialStatus = 'Partial';
        }

        $invoices[] = [
            // main_id is the raw ID for your PHP links, id is the INV- format for display
            'main_id' => $row['id'],
            'id' => $row['booking_id'] ?: 'INV-' . str_pad($row['id'], 4, '0', STR_PAD_LEFT),
            'user' => $row['customer_name'],
            'date' => date('M d, Y', strtotime($row['pickup_date'])),
            'amount' => $totalPrice,
            'paid' => $totalPaid,
            'balance' => max(0, $totalPrice - $totalPaid),
            'status' => $financialStatus,
            'booking_status' => ucfirst($row['booking_status'])
        ];
    }

    echo json_encode(["status" => "success", "data" => $invoices]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}