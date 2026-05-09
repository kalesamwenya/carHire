<?php
// FILE: api/reports/auto_tax_sync.php

require_once __DIR__ . '/../config/origin.php';
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/EmailHelper.php';

$pdo = getDB();
// Suggestion: Move this email to your config or an env variable later
$auditor_email = 'godfreykangwa97@gmail.com'; 
$current_month = date('F Y');

try {
    // 1. Fetch current data (Verified payments only)
    // Using a JOIN if you need specific booking details, but keeping it simple per your schema
    $query = "
        SELECT 
            DATE_FORMAT(paid_at, '%M %Y') as month_name, 
            SUM(amount_paid) as total_revenue 
        FROM payments 
        WHERE payment_status = 'Verified' 
        GROUP BY month_name 
        ORDER BY paid_at DESC
    ";
    
    $stmt = $pdo->query($query);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($data)) {
        echo "No verified data found for this period. Email skipped.";
        exit;
    }

    // 2. Create CSV in Memory
    $f = fopen('php://memory', 'w');
    fputcsv($f, ['Month', 'Gross Revenue (K)', 'Turnover Tax 4% (K)', 'VAT 16% (K)', 'Net Revenue (K)']);
    
    foreach ($data as $row) {
        $revenue = (float)$row['total_revenue'];
        $tot = $revenue * 0.04;
        $vat = $revenue * 0.16;
        $net = $revenue - $tot - $vat;
        
        fputcsv($f, [
            $row['month_name'], 
            number_format($revenue, 2, '.', ''), 
            number_format($tot, 2, '.', ''), 
            number_format($vat, 2, '.', ''), 
            number_format($net, 2, '.', '')
        ]);
    }
    
    fseek($f, 0);
    $csv_raw = stream_get_contents($f);
    $csv_base64 = base64_encode($csv_raw); // Helper expects base64
    fclose($f);

    // 3. Prepare Branded Content
    $subject = "Monthly Tax Report: $current_month - CityDrive Hire";
    $content = "
        <h2 style='color: #0f172a; margin-top: 0;'>Monthly Financial Summary</h2>
        <p>Hello,</p>
        <p>This is an automated tax report for <strong>CityDrive Hire</strong> for the period ending <strong>$current_month</strong>.</p>
        
        <div style='background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0;'>
            <table style='width: 100%; font-size: 14px;'>
                <tr>
                    <td style='color: #64748b; padding-bottom: 5px;'>Report Type:</td>
                    <td style='font-weight: bold; text-align: right;'>Tax Compliance (TOT/VAT)</td>
                </tr>
                <tr>
                    <td style='color: #64748b;'>Generation Date:</td>
                    <td style='font-weight: bold; text-align: right;'>" . date('d M, Y H:i') . "</td>
                </tr>
            </table>
        </div>

        <p>Please find the attached CSV file containing the breakdown of revenue and tax liabilities. This report is generated based on <strong>Verified</strong> payments only.</p>
        <p>If there are any discrepancies, please log into the Admin Panel to review the transaction logs.</p>
    ";

    // 4. Send via EmailHelper
    $attachmentName = "CityDrive_Tax_Report_" . date('Y_m') . ".csv";
    $sent = EmailHelper::sendBrandedEmail($auditor_email, $subject, $content, $csv_base64, $attachmentName);

    if ($sent) {
        echo "Success: Branded report sent to $auditor_email";
    } else {
        echo "Error: Failed to send branded email.";
    }

} catch (Exception $e) {
    error_log("Tax Sync Failed: " . $e->getMessage());
    echo "Error: " . $e->getMessage();
}