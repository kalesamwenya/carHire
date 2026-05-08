<?php
/**
 * FILE: api/bookings/upload_receipt.php
 * Handles PDF storage, Database update, and automated email dispatch.
 * 100% CityDrive Hire Branded
 */

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

require_once '../config/config.php';
require_once '../config/EmailHelper.php';

$data = json_decode(file_get_contents("php://input"), true);

$id_input   = $data['booking_id'] ?? null; // Can be "35" or "INV-35"
$pdf_base64 = $data['pdf_base64'] ?? null;
$email      = $data['email']      ?? null;
$name       = $data['name']       ?? 'Valued Client';

if (!$id_input || !$pdf_base64 || !$email) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required booking data."]);
    exit;
}

// 1. FILE SYSTEM HANDLING
$upload_dir = "../uploads/receipts/";
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Ensure unique filename
$clean_name = preg_replace('/[^a-zA-Z0-9_-]/', '', $id_input);
$filename = "CityDrive_Receipt_" . $clean_name . "_" . time() . ".pdf";
$db_path = "uploads/receipts/" . $filename; 
$server_path = $upload_dir . $filename;

try {
    $pdo = getDB();

    // 2. RESOLVE INTERNAL BOOKING ID
    $find = $pdo->prepare("SELECT id, booking_id FROM bookings WHERE id = ? OR booking_id = ? LIMIT 1");
    $find->execute([$id_input, $id_input]);
    $booking = $find->fetch(PDO::FETCH_ASSOC);

    if (!$booking) throw new Exception("Booking record not found.");

    $internal_id = $booking['id'];
    $display_id  = $booking['booking_id'] ?: $internal_id;

    // 3. SAVE PDF (Existing logic is good)
    if (strpos($pdf_base64, ',') !== false) {
        @list($type, $pdf_base64) = explode(',', $pdf_base64);
    }
    $decoded_pdf = base64_decode($pdf_base64, true);
    file_put_contents($server_path, $decoded_pdf);

  // 4. DATABASE UPDATE
try {
    $pdo = getDB();

    // Attempt 1: Update using the Display ID (e.g., INV-1001)
    // This is most likely what your 'payments' table uses as 'booking_id'
    $updateStmt = $pdo->prepare("UPDATE payments SET receipt_path = ? WHERE booking_id = ?");
    $updateStmt->execute([$db_path, $display_id]);

    // Check if the first attempt actually updated a row
    if ($updateStmt->rowCount() === 0) {
        // Attempt 2: Update using the Internal Numeric ID (e.g., 35)
        // If Attempt 1 found no rows, we try the primary key instead
        $updateStmt->execute([$db_path, $internal_id]);
    }

    // Optional: Log if both attempts failed to find a record
    if ($updateStmt->rowCount() === 0) {
        error_log("Warning: No payment record found to update for Booking $display_id / $internal_id");
        // Note: This won't throw an error, it just means the path wasn't stored 
        // because the payment row doesn't exist yet.
    }

} catch (PDOException $e) {
    throw new Exception("Database Error: Could not save receipt path. " . $e->getMessage());
}
    // 5. FETCH DETAILS FOR EMAILS (Fixed the WHERE clause and column names)
    $stmt = $pdo->prepare("
        SELECT 
            b.total_price,
            c.name AS car_name,
            u_part.email AS partner_email, 
            pa.business_name
        FROM bookings b
        INNER JOIN cars c ON b.car_id = c.id
        LEFT JOIN users u_part ON c.partner_id = u_part.id
        LEFT JOIN partner_about pa ON u_part.id = pa.user_id
        WHERE b.id = ?  -- Added this critical filter
    ");
    $stmt->execute([$internal_id]);
    $info = $stmt->fetch(PDO::FETCH_ASSOC);

    // 6. EMAIL DISPATCH
    $custSubject = "Confirmed: Your CityDrive Hire Receipt #$display_id";
    // Using $info['car_name'] and $info['total_price'] fetched from DB for accuracy
    $carLabel = $info['car_name'] ?? 'Reserved Vehicle';
    $priceLabel = number_format($info['total_price'] ?? 0, 2);

    $custContent = "
        <p>Hello <strong>$name</strong>,</p>
        <p>Your payment for booking <strong>#$display_id</strong> has been verified.</p>
        <div style='background: #f8fafc; padding: 15px; border-radius: 8px;'>
            <p><strong>Vehicle:</strong> $carLabel</p>
            <p><strong>Amount:</strong> K$priceLabel</p>
        </div>
        <p>Please find your official receipt attached.</p>
    ";

    // Call helper with the raw base64 (EmailHelper decodes it)
    EmailHelper::sendBrandedEmail($email, $custSubject, $custContent, $pdf_base64, $filename);

    // 7. PARTNER NOTIFICATION
    if (!empty($info['partner_email'])) {
        EmailHelper::sendPartnerAlert(
            $info['partner_email'],
            $info['business_name'],
            $carLabel,
            $display_id,
            $name,
            $info['total_price']
        );
    }

    echo json_encode(["success" => true, "message" => "Receipt sent!"]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database Error: " . $e->getMessage()]);
}