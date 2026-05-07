<?php
// File: config/notifications.php

function sendBookingAlert($toEmail, $partnerName, $carName, $customerName, $totalPrice) {
    $subject = "New Booking Request: $carName - CityDrive";
    
    $message = "
    <html>
    <head>
        <title>New Booking Request</title>
    </head>
    <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
        <div style='max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;'>
            <h2 style='color: #16a34a;'>New Booking for $partnerName!</h2>
            <p>Hello,</p>
            <p>You have received a new rental request for your <strong>$carName</strong>.</p>
            <hr style='border: 0; border-top: 1px solid #eee;' />
            <p><strong>Customer:</strong> $customerName</p>
            <p><strong>Value:</strong> ZMW $totalPrice</p>
            <hr style='border: 0; border-top: 1px solid #eee;' />
            <p>Please log in to your dashboard to accept or decline this request.</p>
            <a href='https://yourdomain.com/partner/bookings' 
               style='display: inline-block; padding: 10px 20px; background-color: #16a34a; color: #fff; text-decoration: none; border-radius: 5px;'>
               Manage Booking
            </a>
        </div>
    </body>
    </html>
    ";

    // Headers for HTML email
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: CityDrive Alerts <noreply@yourdomain.com>" . "\r\n";

    return mail($toEmail, $subject, $message, $headers);
}