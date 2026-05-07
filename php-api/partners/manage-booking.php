<?php
// File: partners/manage-booking.php
require_once '../config/origin.php';
require_once '../config/config.php';

header('Content-Type: application/json');

$pdo = getDB();

// GET: Fetch all requests for this partner
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = $_GET['user_id'] ?? null;

    if (!$userId) {
        echo json_encode(["success" => false, "message" => "User ID required"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT 
                b.id, b.start_date, b.end_date, b.total_price, b.status, b.created_at,
                u.name as customer_name, u.email as customer_email,
                v.make_model as car_name, v.plate_number
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN vehicles v ON b.vehicle_id = v.id
            WHERE v.partner_id = ?
            ORDER BY b.created_at DESC
        ");
        $stmt->execute([$userId]);
        $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["success" => true, "data" => $requests ?: []]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}

// POST: Update booking status (Confirm/Decline)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $bookingId = $data['booking_id'] ?? null;
    $newStatus = $data['status'] ?? null; // 'Confirmed' or 'Cancelled'

    if (!$bookingId || !$newStatus) {
        echo json_encode(["success" => false, "message" => "Missing data"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE bookings SET status = ? WHERE id = ?");
        $stmt->execute([$newStatus, $bookingId]);

        echo json_encode(["success" => true, "message" => "Booking $newStatus"]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}