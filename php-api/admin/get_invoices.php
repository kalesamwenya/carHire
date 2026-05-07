<?php
require_once '../config/origin.php';
require_once '../config/config.php';
$pdo = getDB();

try {
    // We treat confirmed and completed bookings as generated invoices
    $stmt = $pdo->query("SELECT id, customer_name, pickup_date, total_price, status 
                         FROM bookings 
                         WHERE status IN ('confirmed', 'completed', 'refunded')
                         ORDER BY pickup_date DESC");
    
    $invoices = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $invoices[] = [
            'id' => 'INV-' . str_pad($row['id'], 4, '0', STR_PAD_LEFT),
            'user' => $row['customer_name'],
            'date' => date('M d, Y', strtotime($row['pickup_date'])),
            'amount' => $row['total_price'],
            'status' => ucfirst($row['status'])
        ];
    }

    echo json_encode(["status" => "success", "data" => $invoices]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}