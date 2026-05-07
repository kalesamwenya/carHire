<?php
require_once '../config/config.php';
require_once '../vendor/autoload.php'; // Requires Dompdf

use Dompdf\Dompdf;
use Dompdf\Options;

$pdo = getDB();
$reportMonth = date('F Y', strtotime('last month'));
$firstDay = date('Y-m-01', strtotime('last month'));
$lastDay = date('Y-m-t', strtotime('last month'));

try {
    // 1. Fetch Revenue per car
    $revSql = "SELECT c.name, c.plate_number, SUM(b.total_price) as revenue 
               FROM bookings b 
               JOIN cars c ON b.car_id = c.id 
               WHERE b.booking_date BETWEEN ? AND ?
               GROUP BY c.id";
    $stmt = $pdo->prepare($revSql);
    $stmt->execute([$firstDay, $lastDay]);
    $revenueData = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Fetch Maintenance per car
    $maintSql = "SELECT car_id, SUM(cost) as total_maint 
                 FROM car_services 
                 WHERE service_date BETWEEN ? AND ?
                 GROUP BY car_id";
    $stmt = $pdo->prepare($maintSql);
    $stmt->execute([$firstDay, $lastDay]);
    $maintData = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

    // 3. Generate HTML for PDF
    $html = "
    <style>
        body { font-family: sans-serif; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 20px; }
        .summary-box { background: #f8fafc; padding: 20px; margin: 20px 0; border-radius: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #0f172a; color: white; padding: 10px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        .profit { color: #16a34a; font-weight: bold; }
        .loss { color: #dc2626; font-weight: bold; }
    </style>
    <div class='header'>
        <h1>Emit Photography</h1>
        <p>Fleet Performance Report: $reportMonth</p>
    </div>
    <table>
        <thead>
            <tr>
                <th>Vehicle</th>
                <th>Revenue</th>
                <th>Maintenance</th>
                <th>Net Profit</th>
            </tr>
        </thead>
        <tbody>";

    $totalFleetProfit = 0;
    foreach ($revenueData as $row) {
        $maint = $maintData[$row['car_id']] ?? 0;
        $profit = $row['revenue'] - $maint;
        $totalFleetProfit += $profit;
        $profitClass = $profit >= 0 ? 'profit' : 'loss';

        $html .= "
            <tr>
                <td>{$row['name']}<br><small>{$row['plate_number']}</small></td>
                <td>K" . number_format($row['revenue'], 2) . "</td>
                <td>K" . number_format($maint, 2) . "</td>
                <td class='$profitClass'>K" . number_format($profit, 2) . "</td>
            </tr>";
    }

    $html .= "</tbody></table>
    <div class='summary-box'>
        <h3>Total Monthly Fleet Profit: K" . number_format($totalFleetProfit, 2) . "</h3>
    </div>";

    // Initialize Dompdf
    $options = new Options();
    $options->set('isHtml5ParserEnabled', true);
    $dompdf = new Dompdf($options);
    $dompdf->loadHtml($html);
    $dompdf->setPaper('A4', 'portrait');
    $dompdf->render();
    
    $pdfOutput = $dompdf->output();
    $fileName = "Emit_Report_" . date('Y_m', strtotime('last month')) . ".pdf";

    // 4. Send Email with Attachment
    sendEmailWithAttachment($pdfOutput, $fileName, $reportMonth);

} catch (Exception $e) {
    error_log($e->getMessage());
}