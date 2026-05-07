<?php
/**
 * FILE: api/bookings/upload_receipt.php
 * Handles PDF storage, Database update, and automated email dispatch.
 * 100% CityDrive Hire Branded
 */

header("Access-Control-Allow-Origin: *"); // For production, replace * with your Next.js domain
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle Pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

require_once '../config/config.php';
require_once '../config/EmailHelper.php';

$data = json_decode(file_get_contents("php://input"), true);

$booking_id = $data['booking_id'] ?? null;
$pdf_base64 = $data['pdf_base64'] ?? null;
$email      = $data['email']       ?? null;
$name       = $customer_name       = $data['name'] ?? 'Valued Client';

if (!$booking_id || !$pdf_base64 || !$email) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required booking data."]);
    exit;
}

// 1. FILE SYSTEM HANDLING
$upload_dir = "../uploads/receipts/";
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Clean filename to prevent injection
$clean_id = preg_replace('/[^a-zA-Z0-9_-]/', '', $booking_id);
$filename = "CityDrive_Receipt_" . $clean_id . ".pdf";
$db_path = "uploads/receipts/" . $filename; 
$server_path = $upload_dir . $filename;

try {
    // 2. SANITIZE BASE64
    if (strpos($pdf_base64, ',') !== false) {
        @list($type, $pdf_base64) = explode(',', $pdf_base64);
    }

    $decoded_pdf = base64_decode($pdf_base64, true);
    if (!$decoded_pdf) throw new Exception("Invalid PDF encoding.");
    
    if (!file_put_contents($server_path, $decoded_pdf)) {
        throw new Exception("Server Error: Cannot save receipt. Check folder permissions.");
    }

    $pdo = getDB();

    // 3. DATABASE UPDATE
    // Updates the receipts path in the payments table for verification
    $updateStmt = $pdo->prepare("UPDATE payments SET receipt_path = ? WHERE booking_id = ?");
    $updateStmt->execute([$db_path, $booking_id]);

    // 4. FETCH DETAILS FOR EMAILS
    $stmt = $pdo->prepare("
        SELECT 
            u.email as partner_email, 
            pa.business_name, 
            c.name as car_name, 
            b.total_price
        FROM bookings b
        JOIN cars c ON b.car_id = c.id
        JOIN users u ON c.partner_id = u.id
        JOIN partner_about pa ON u.id = pa.user_id
        WHERE b.booking_id = ?
    ");
    $stmt->execute([$booking_id]);
    $info = $stmt->fetch(PDO::FETCH_ASSOC);

    // 5. EMAIL DISPATCH (Customer) - BRANDED FOR CITYDRIVE
    $custSubject = "Confirmed: Your CityDrive Hire Receipt #$booking_id";
    $custContent = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; color: #1e293b; line-height: 1.6;'>
            <div style='background: #0f172a; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;'>
                <h1 style='color: white; margin: 0; font-size: 24px;'>City<span style='color: #16a34a;'>Drive</span></h1>
            </div>
            <div style='padding: 30px; border: 1px solid #f1f5f9;'>
                <h2 style='color: #16a34a; margin-top: 0;'>Payment Confirmed!</h2>
                <p>Hello <strong>$name</strong>,</p>
                <p>Your booking has been successfully verified and paid. Please find your official digital receipt attached to this email.</p>
                <div style='background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;'>
                    <p style='margin: 5px 0;'><strong>Booking ID:</strong> $booking_id</p>
                    <p style='margin: 5px 0;'><strong>Vehicle:</strong> " . ($info['car_name'] ?? 'Reserved Vehicle') . "</p>
                </div>
                <p><strong>Next Steps:</strong> Please present the QR code on the attached receipt to our agent during vehicle pickup.</p>
                <hr style='border: 0; border-top: 1px solid #f1f5f9; margin: 25px 0;' />
                <p style='font-size: 11px; color: #94a3b8; text-align: center;'>
                    CityDrive Hire Zambia | Premium Vehicle Rentals<br>
                    Support: +260 972 338 115
                </p>
            </div>
        </div>
    ";

    // Pass the cleaned base64 for the email attachment
    EmailHelper::sendBrandedEmail($email, $custSubject, $custContent, $pdf_base64, $filename);

    // 6. PARTNER NOTIFICATION
    if ($info) {
        EmailHelper::sendPartnerAlert(
            $info['partner_email'],
            $info['business_name'],
            $info['car_name'],
            $booking_id,
            $name,
            $info['total_price']
        );
    }

    echo json_encode([
        "success" => true, 
        "message" => "Receipt generated and dispatched via email.",
        "path" => $db_path
    ]);

} catch (Exception $e) {
    error_log("Receipt Upload Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server Error: " . $e->getMessage()]);
}