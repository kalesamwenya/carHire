<?php
require_once '../config/origin.php';
require_once '../config/config.php';

// Security: Check for Secret Key (Update 'YOUR_SECRET_KEY' to something unique)
$securityKey = "9f1c2e3a4b5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1";
if (php_sapi_name() !== 'cli' && ($_GET['key'] ?? '') !== $securityKey) {
    header('HTTP/1.0 403 Forbidden');
    die("Unauthorized access.");
}

$pdo = getDB();
$businessEmail = "info@citydrivehire.com"; 
$businessNumber = "0972338115";

try {
    // Fetch Overdue Vehicles (180 Days)
    $sql = "
        SELECT c.id, c.name, c.plate_number, MAX(s.service_date) as last_service
        FROM cars c
        LEFT JOIN car_services s ON c.id = s.car_id
        GROUP BY c.id
        HAVING last_service IS NULL OR last_service < DATE_SUB(NOW(), INTERVAL 180 DAY)
    ";
    
    $stmt = $pdo->query($sql);
    $overdueCars = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($overdueCars) > 0) {
        $subject = "🔧 Fleet Action Required: " . count($overdueCars) . " Vehicles Overdue";
        
        // Branding Variables
        $primaryColor = "#0f172a"; // Professional Slate
        $accentColor = "#10b981";  // Emerald Green
        $errorColor = "#ef4444";   // Alert Red

        // Email Body Construction
        $message = "
        <div style='background-color: #f8fafc; padding: 40px; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif;'>
            <div style='max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);'>
                
                <div style='background-color: {$primaryColor}; padding: 32px; text-align: center;'>
                    <h1 style='color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;'>
                        Emit Photography
                    </h1>
                    <div style='height: 2px; width: 40px; background: {$accentColor}; margin: 12px auto 0;'></div>
                </div>

                <div style='padding: 40px;'>
                    <h2 style='color: {$primaryColor}; font-size: 18px; margin-bottom: 16px;'>Maintenance Reminder</h2>
                    <p style='color: #64748b; font-size: 15px; line-height: 1.6; margin-bottom: 24px;'>
                        Our records indicate that the following vehicles have exceeded the 180-day safety service interval. Please schedule maintenance as soon as possible.
                    </p>

                    <table style='width: 100%; border-collapse: collapse;'>
                        <thead>
                            <tr style='text-align: left; border-bottom: 1px solid #e2e8f0;'>
                                <th style='padding: 12px 0; color: #94a3b8; font-size: 11px; text-transform: uppercase;'>Vehicle</th>
                                <th style='padding: 12px 0; color: #94a3b8; font-size: 11px; text-transform: uppercase; text-align: right;'>Days Since Service</th>
                            </tr>
                        </thead>
                        <tbody>";

        foreach ($overdueCars as $car) {
            $lastDate = $car['last_service'] ? date('M d, Y', strtotime($car['last_service'])) : 'No Record';
            $message .= "
                            <tr style='border-bottom: 1px solid #f1f5f9;'>
                                <td style='padding: 16px 0;'>
                                    <div style='color: #1e293b; font-weight: 600; font-size: 14px;'>{$car['name']}</div>
                                    <div style='color: #94a3b8; font-size: 12px;'>{$car['plate_number']}</div>
                                </td>
                                <td style='padding: 16px 0; text-align: right;'>
                                    <span style='color: {$errorColor}; font-weight: bold; font-size: 13px;'>{$lastDate}</span>
                                </td>
                            </tr>";
        }

        $message .= "
                        </tbody>
                    </table>

                    <div style='margin-top: 32px; text-align: center;'>
                        <a href='https://citydrivehire.com/admin/maintenance' style='background-color: {$primaryColor}; color: #ffffff; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-block;'>
                            Open Fleet Dashboard
                        </a>
                    </div>
                </div>

                <div style='background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;'>
                    <p style='color: #94a3b8; font-size: 12px; margin: 0;'>
                        System Auto-Alert &bull; $businessNumber
                    </p>
                </div>
            </div>
        </div>";

        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8\r\n";
        $headers .= "From: Emit Fleet <system@citydrivehire.com\r\n";

        mail($businessEmail, $subject, $message, $headers);
        echo "Branded alert sent successfully.";
    }

} catch (PDOException $e) {
    error_log("[" . date('Y-m-d H:i:s') . "] Fleet Cron Error: " . $e->getMessage() . "\n", 3, "../logs/cron_errors.log");
}