<?php
// FILE: api/config/EmailHelper.php

require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

class EmailHelper {
    private static $brandColor = "#16a34a"; // CityDrive Green
    private static $darkBg = "#0f172a"; 
    private static $companyName = "CityDriveHire";
    private static $supportPhone = "+260 972 338 115";
    private static $logoIconUrl = "https://citydrivehire.com/assets/email-car-icon.png"; 

    // --- HOSTINGER SMTP SETTINGS ---
    private static $smtpHost = 'smtp.hostinger.com';
    private static $smtpUser = 'noreply@citydrivehire.com'; 
    private static $smtpPass = '@Citydrive26'; 
    private static $smtpPort = 465;

    /**
     * Core method to send authenticated branded emails via SMTP
     */
    public static function sendBrandedEmail($to, $subject, $content, $attachmentBase64 = null, $attachmentName = "document.pdf") {
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = self::$smtpHost;
            $mail->SMTPAuth   = true;
            $mail->Username   = self::$smtpUser;
            $mail->Password   = self::$smtpPass;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; 
            $mail->Port       = self::$smtpPort;
            $mail->CharSet    = 'UTF-8';

            $mail->setFrom(self::$smtpUser, self::$companyName);
            $mail->addAddress($to);

            $logoHeader = "
            <div style='background-color: #ffffff; padding: 25px 20px; border-bottom: 1px solid #f1f5f9;'>
                <table border='0' cellpadding='0' cellspacing='0' style='width: 100%;'>
                    <tr>
                        <td style='width: 42px;'>
                            <div style='width: 40px; height: 40px; background-color: ".self::$darkBg."; border-radius: 10px; text-align: center;'>
                                <img src='".self::$logoIconUrl."' width='22' height='22' style='margin-top: 9px; vertical-align: middle;' alt='Car'>
                            </div>
                        </td>
                        <td style='padding-left: 12px; vertical-align: middle;'>
                            <h1 style='margin: 0; font-size: 20px; font-weight: bold; color: ".self::$darkBg."; line-height: 1; font-family: sans-serif;'>
                                City<span style='color: ".self::$brandColor.";'>Drive</span>
                            </h1>
                            <p style='margin: 2px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; color: #64748b; font-family: sans-serif;'>Hire</p>
                        </td>
                    </tr>
                </table>
            </div>";

            $htmlMessage = "
            <div style='font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: white;'>
                $logoHeader
                <div style='padding: 30px; line-height: 1.6; color: #334155;'>
                    $content
                </div>
                <div style='background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9;'>
                    <p style='margin-bottom: 5px; color: #475569; font-weight: bold;'>Emit Photography & Rentals</p>
                    <p style='margin-bottom: 5px;'>Need help? Contact us at <strong style='color: #475569;'>".self::$supportPhone."</strong></p>
                    <p style='margin: 0;'>&copy; ".date('Y')." CityDriveHire. All rights reserved.</p>
                </div>
            </div>";

            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $htmlMessage;
            $mail->AltBody = strip_tags($content);

            if ($attachmentBase64) {
                $mail->addStringAttachment(base64_decode($attachmentBase64), $attachmentName);
            }

            return $mail->send();
        } catch (Exception $e) {
            error_log("PHPMailer Error: " . $mail->ErrorInfo);
            return false;
        }
    }

    // --- PARTNER & ADMIN METHODS ---

    public static function sendPartnerAlert($partnerEmail, $partnerName, $carName, $bookingId, $custName, $total) {
        $content = "
            <h2 style='color: ".self::$brandColor."; margin-top: 0;'>New Confirmed Booking!</h2>
            <p>Hello <strong>$partnerName</strong>,</p>
            <p>Good news! Your vehicle <strong>$carName</strong> has been booked and <strong>fully paid for</strong>.</p>
            <div style='background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;'>
                <p style='margin: 5px 0;'><strong>Booking ID:</strong> #$bookingId</p>
                <p style='margin: 5px 0;'><strong>Customer:</strong> $custName</p>
                <p style='margin: 5px 0;'><strong>Payout Amount:</strong> K " . number_format($total, 2) . "</p>
            </div>
            <div style='text-align: center;'>
                <a href='https://citydrivehire.com/partner/dashboard' style='background: ".self::$brandColor."; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;'>Manage Booking</a>
            </div>";
        return self::sendBrandedEmail($partnerEmail, "Payment Confirmed: Booking #$bookingId", $content);
    }

    public static function sendVerificationEmail($to, $name, $token, $isPartner = false) {
        $type = $isPartner ? "Partner" : "Customer";
        $link = "https://citydrivehire.com/auth/verify?token=" . $token . "&email=" . urlencode($to);
        $content = "
            <h2 style='color: ".self::$brandColor.";'>Welcome to CityDriveHire!</h2>
            <p>Hello <strong>$name</strong>,</p>
            <p>Please verify your email address to get started as a $type:</p>
            <div style='text-align: center; margin: 30px 0;'>
                <a href='$link' style='background: ".self::$brandColor."; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;'>Verify My Account</a>
            </div>";
        return self::sendBrandedEmail($to, "Verify your $type Account", $content);
    }

    // --- BOOKING WORKFLOW METHODS ---

    public static function sendBookingPendingEmail($custEmail, $custName, $carName, $bookingId, $pickupDate, $total) {
        $customerContent = "
            <h2 style='color: ".self::$darkBg."; margin-top: 0;'>Reservation Received!</h2>
            <p>Hello <strong>$custName</strong>, we've received your reservation for the <strong>$carName</strong>. Your booking is currently <strong>Pending</strong>.</p>
            <div style='background: #f8fafc; border-left: 4px solid ".self::$brandColor."; padding: 15px; margin: 20px 0;'>
                <h3 style='margin: 0 0 10px 0; font-size: 14px; color: ".self::$brandColor."; text-transform: uppercase;'>What happens next?</h3>
                <ol style='margin: 0; padding-left: 20px; font-size: 14px; color: #475569;'>
                    <li>Visit our office at pickup: <strong>$pickupDate</strong>.</li>
                    <li>Pay <strong>K " . number_format($total, 2) . "</strong> via Cash or Swipe.</li>
                    <li>Your booking will be confirmed!</li>
                </ol>
            </div>";
        self::sendBrandedEmail($custEmail, "Your Reservation: #$bookingId", $customerContent);
        
        $adminEmail = "info@citydrivehire.com";
        $adminContent = "<h2>New Pending Reservation</h2><p>Customer $custName has reserved $carName. Payment: Pay at Office.</p>";
        return self::sendBrandedEmail($adminEmail, "ALERT: New Pending Booking #$bookingId", $adminContent);
    }

    public static function sendBookingConfirmedEmail($email, $name, $car, $id, $date, $total) {
        $content = "
            <div style='text-align: center; margin-bottom: 25px;'>
                <div style='background: #dcfce7; color: #166534; width: 60px; height: 60px; line-height: 60px; border-radius: 50%; display: inline-block; font-size: 30px;'>✓</div>
            </div>
            <h2 style='color: ".self::$darkBg."; text-align: center;'>Booking Confirmed!</h2>
            <p>Hello $name, your payment for the <strong>$car</strong> is processed. Pickup: <strong>".date('l, M j, Y', strtotime($date))."</strong>.</p>
            <div style='text-align: center; margin-top: 30px;'>
                <a href='https://citydrivehire.com' style='background: ".self::$brandColor."; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;'>Visit Website</a>
            </div>";
        return self::sendBrandedEmail($email, "Booking Confirmed: #$id", $content);
    }

    public static function sendBookingCancelledEmail($toEmail, $customerName, $carName, $bookingId) {
        $statusColor = "#e11d48"; 
        $content = "
            <div style='text-align: center; margin-bottom: 25px;'>
                <div style='background: #fff1f2; color: $statusColor; width: 60px; height: 60px; line-height: 60px; border-radius: 50%; display: inline-block; font-size: 30px;'>✕</div>
            </div>
            <h2 style='color: ".self::$darkBg."; text-align: center;'>Booking Cancelled</h2>
            <p>Hello $customerName, your reservation #$bookingId for $carName has been cancelled.</p>
            <p>Contact us at <strong>".self::$supportPhone."</strong> if you need assistance.</p>";
        return self::sendBrandedEmail($toEmail, "Booking Cancelled - #$bookingId", $content);
    }

    public static function sendFeedbackRequestEmail($email, $name, $car, $id, $car_image) {
        $review_link = "https://citydrivehire.com/reviews?booking_id=" . $id;
        $image_url = $car_image ?: "https://citydrivehire.com/assets/default-car.png";
        $content = "
            <h2 style='text-align: center;'>How was your journey, $name?</h2>
            <div style='background-color: #f8fafc; border-radius: 16px; padding: 20px; text-align: center; margin: 25px 0;'>
                <img src='$image_url' alt='$car' style='max-width: 200px; border-radius: 8px;'>
                <p style='font-weight: bold; margin-top: 10px;'>$car</p>
            </div>
            <div style='text-align: center;'>
                <a href='$review_link' style='background-color: ".self::$brandColor."; color: white; padding: 18px 36px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;'>Rate Your Experience</a>
            </div>";
        return self::sendBrandedEmail($email, "How was your drive? - #$id", $content);
    }

    public static function sendPasswordReset($to, $name, $token) {
        $link = "https://citydrivehire.com/auth/reset-password?token=" . $token . "&email=" . urlencode($to);
        $content = "<h2>Password Reset</h2><p>Hi $name, click below to reset your password:</p>
                    <a href='$link' style='background: ".self::$brandColor."; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px;'>Reset Password</a>";
        return self::sendBrandedEmail($to, "Reset Your Password", $content);
    }

    public static function sendRefundedEmail($toEmail, $customerName, $carName, $bookingId, $amount) {
    $subject = "Refund Processed - Booking #$bookingId";
    $body = "
        <div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
            <h2 style='color: #e67e22;'>Refund Confirmed</h2>
            <p>Hello $customerName,</p>
            <p>We are writing to let you know that a refund of <strong>K$amount</strong> has been processed for your booking <strong>#$bookingId</strong> ($carName).</p>
            <p>Depending on your bank, the funds should appear in your account within 3-7 business days.</p>
            <p>If you have any questions, please reply to this email.</p>
            <br>
            <p>Best regards,<br>The CityDrive Team</p>
        </div>
    ";
    return self::sendEmail($toEmail, $subject, $body);
}

public static function sendPartnerRefundAlert($toEmail, $partnerName, $carName, $bookingId, $amount) {
    $subject = "Action Required: Refund Processed for #$bookingId";
    $body = "
        <div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
            <h2 style='color: #d35400;'>Booking Refunded</h2>
            <p>Hello $partnerName,</p>
            <p>This is to notify you that a refund has been issued for booking <strong>#$bookingId</strong> involving the <strong>$carName</strong>.</p>
            <p><strong>Refund Amount:</strong> K$amount</p>
            <p>Please update your records accordingly. If the vehicle was held for this booking, it has now been marked as available for the selected dates.</p>
            <br>
            <p>CityDrive Admin System</p>
        </div>
    ";
    return self::sendEmail($toEmail, $subject, $body);
}

public static function sendRefundProcessedEmail($email, $name, $bookingId, $refundAmount, $fee) {
    $subject = "Refund Processed - $bookingId";
    $message = "
        <div style='font-family: sans-serif; color: #333;'>
            <h2>Refund Confirmation</h2>
            <p>Hello $name,</p>
            <p>Your refund for booking <strong>$bookingId</strong> has been processed.</p>
            
            <div style='background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0;'>
                <p><strong>Total Paid:</strong> K" . ($refundAmount + $fee) . "</p>
                <p style='color: #e53e3e;'><strong>Cancellation Fee:</strong> K$fee</p>
                <hr>
                <p style='font-size: 18px; color: #2f855a;'><strong>Refund Amount:</strong> K$refundAmount</p>
            </div>

            <p style='font-size: 12px; color: #718096; margin-top: 20px;'>
                The refund will reflect in your account within 3-5 business days depending on your provider.
            </p>
        </div>
    ";
    return self::send($email, $subject, $message);
}

public static function sendSupportReply(
    $toEmail,
    $customerName,
    $subject,
    $replyMessage
) {

    $content = "
        <div style='text-align:center; margin-bottom:30px;'>

            <div style='
                width:70px;
                height:70px;
                margin:auto;
                border-radius:20px;
                background:linear-gradient(135deg,#16a34a,#22c55e);
                text-align:center;
                line-height:70px;
                font-size:30px;
                color:white;
                font-weight:bold;
                box-shadow:0 15px 30px rgba(34,197,94,0.25);
            '>
                ✉
            </div>

        </div>

        <h2 style='
            font-size:28px;
            font-weight:900;
            color:#0f172a;
            margin-top:0;
            margin-bottom:15px;
            text-align:center;
        '>
            Support Response
        </h2>

        <p style='
            font-size:15px;
            color:#475569;
            line-height:1.8;
            margin-bottom:20px;
        '>
            Hello <strong>$customerName</strong>,
        </p>

        <p style='
            font-size:15px;
            color:#475569;
            line-height:1.8;
        '>
            Thank you for contacting the CityDrive Hire support team.
            Below is our response regarding your inquiry:
        </p>

        <div style='
            margin-top:25px;
            background:#f8fafc;
            border:1px solid #e2e8f0;
            border-left:5px solid #16a34a;
            border-radius:18px;
            padding:25px;
        '>

            <p style='
                margin:0 0 12px 0;
                font-size:11px;
                letter-spacing:2px;
                text-transform:uppercase;
                font-weight:800;
                color:#16a34a;
            '>
                SUPPORT MESSAGE
            </p>

            <div style='
                font-size:15px;
                color:#334155;
                line-height:1.9;
                white-space:pre-line;
            '>
                $replyMessage
            </div>

        </div>

        <div style='
            margin-top:30px;
            padding:20px;
            border-radius:16px;
            background:#eff6ff;
            border:1px solid #bfdbfe;
        '>

            <p style='
                margin:0;
                color:#1e3a8a;
                font-size:14px;
                line-height:1.8;
            '>
                If you need additional assistance, simply reply to this email
                or contact our support team directly.
            </p>

        </div>

        <div style='text-align:center; margin-top:35px;'>

            <a href='https://citydrivehire.com/contact'
               style='
                    display:inline-block;
                    background:#16a34a;
                    color:white;
                    padding:15px 28px;
                    border-radius:14px;
                    text-decoration:none;
                    font-weight:800;
                    font-size:14px;
                    box-shadow:0 10px 25px rgba(22,163,74,0.25);
               '>
                Contact Support
            </a>

        </div>
    ";

    return self::sendBrandedEmail(
        $toEmail,
        "Re: $subject",
        $content
    );
}

public static function sendHelpSupportReplyEmail(
    $toEmail,
    $customerName,
    $ticketId,
    $subject,
    $replyMessage
) {

    $content = "
        <div style='text-align:center; margin-bottom:30px;'>

            <div style='
                width:70px;
                height:70px;
                margin:auto;
                border-radius:20px;
                background:linear-gradient(135deg,#16a34a,#22c55e);
                text-align:center;
                line-height:70px;
                font-size:30px;
                color:white;
                font-weight:bold;
                box-shadow:0 15px 30px rgba(34,197,94,0.25);
            '>
                ✉
            </div>

        </div>

        <h2 style='
            font-size:28px;
            font-weight:900;
            color:#0f172a;
            margin-top:0;
            margin-bottom:10px;
            text-align:center;
        '>
            Ticket Response
        </h2>

        <p style='
            text-align:center;
            font-size:13px;
            color:#64748b;
            margin-bottom:25px;
        '>
            Ticket ID: <strong>$ticketId</strong>
        </p>

        <p style='
            font-size:15px;
            color:#475569;
            line-height:1.8;
        '>
            Hello <strong>$customerName</strong>,
        </p>

        <p style='
            font-size:15px;
            color:#475569;
            line-height:1.8;
        '>
            We have responded to your support request:
        </p>

        <div style='
            margin-top:25px;
            background:#f8fafc;
            border:1px solid #e2e8f0;
            border-left:5px solid #16a34a;
            border-radius:18px;
            padding:25px;
        '>

            <p style='
                margin:0 0 12px 0;
                font-size:11px;
                letter-spacing:2px;
                text-transform:uppercase;
                font-weight:800;
                color:#16a34a;
            '>
                SUPPORT RESPONSE
            </p>

            <div style='
                font-size:15px;
                color:#334155;
                line-height:1.9;
                white-space:pre-line;
            '>
                $replyMessage
            </div>

        </div>

        <div style='
            margin-top:30px;
            padding:20px;
            border-radius:16px;
            background:#eff6ff;
            border:1px solid #bfdbfe;
        '>

            <p style='
                margin:0;
                color:#1e3a8a;
                font-size:14px;
                line-height:1.8;
            '>
                If you still need help, reply to this email or open another ticket.
            </p>

        </div>

        <div style='text-align:center; margin-top:35px;'>

            <a href='https://citydrivehire.com/support'
               style='
                    display:inline-block;
                    background:#16a34a;
                    color:white;
                    padding:15px 28px;
                    border-radius:14px;
                    text-decoration:none;
                    font-weight:800;
                    font-size:14px;
               '>
                Visit Support Center
            </a>

        </div>
    ";

    return self::sendBrandedEmail(
        $toEmail,
        "Re: $subject (#$ticketId)",
        $content
    );
}


    
}