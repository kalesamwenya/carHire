<?php
require_once '../config/origin.php';
require_once '../config/config.php';
$pdo = getDB();

// Handle both raw ID and INV- formatted ID
$idParam = $_GET['id'] ?? null;
$cleanId = $_GET['booking_id'] ?? null;

// The Master Query - Optimized with Subquery for accurate payment totals
$sql = "SELECT 
            b.*, 
            c.name AS car_name, c.plate_number, c.color,
            u.phone AS user_phone, u.email AS user_email,
            (SELECT SUM(amount_paid) FROM payments WHERE booking_id = b.id) AS total_amount_paid
        FROM bookings b
        INNER JOIN cars c ON b.car_id = c.id
        INNER JOIN users u ON b.user_id = u.id
        WHERE b.id = ? OR b.booking_id = ?
        LIMIT 1";

$stmt = $pdo->prepare($sql);
$stmt->execute([$cleanId, $idParam]);
$b = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$b) { 
    die("<div style='padding:50px; font-family:sans-serif; text-align:center;'>
            <h1 style='color:#e11d48;'>404: Invoice Not Found</h1>
            <p>The requested invoice #$idParam does not exist in CityDrive system.</p>
         </div>"); 
}

// Financial Math
$quoted = (float)$b['total_price'];
$paid = (float)($b['total_amount_paid'] ?? 0);
$balance = max(0, $quoted - $paid); // Ensure balance isn't negative
$isPaidInFull = ($paid >= $quoted);

$pickup = date('D, M d, Y', strtotime($b['pickup_date']));
$return = date('D, M d, Y', strtotime($b['return_date']));

// Use the public Booking ID for the verification link
$displayId = $b['booking_id'] ?: $b['id'];
$verifyUrl = "https://citydrivehire.com/verify/" . $displayId;
$qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" . urlencode($verifyUrl);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CityDrive Invoice #<?php echo $displayId; ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
        @media print { .no-print { display: none !important; } }
        .watermark { 
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 12rem; font-weight: 900; opacity: 0.05; pointer-events: none; text-transform: uppercase;
        }
    </style>
</head>
<body class="bg-slate-50 p-4 md:p-10">
    <div class="max-w-4xl mx-auto bg-white shadow-2xl rounded-[3rem] overflow-hidden relative border border-slate-200">
        
        <?php if($isPaidInFull): ?>
            <div class="watermark text-green-600">PAID</div>
        <?php endif; ?>

        <!-- Header -->
        <div class="bg-slate-900 p-10 text-white flex flex-col md:flex-row justify-between items-center">
            <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg">
                    <i class="fa-solid fa-car-side text-2xl text-green-600"></i>
                </div>
                <div>
                    <h1 class="text-3xl font-black tracking-tighter">City<span class="text-green-500">Drive</span></h1>
                    <p class="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-400">Premium Car Hire</p>
                </div>
            </div>
            <div class="text-center md:text-right mt-8 md:mt-0">
                <p class="text-[10px] uppercase font-black text-green-500 tracking-widest">Official Invoice</p>
                <p class="text-3xl font-mono text-white font-bold">#<?php echo $displayId; ?></p>
            </div>
        </div>

        <div class="p-8 md:p-14">
            <!-- Info Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                <div class="space-y-3">
                    <h3 class="text-[11px] font-black text-green-600 uppercase tracking-[0.2em] mb-4">Customer Details</h3>
                    <p class="font-black text-2xl text-slate-900"><?php echo htmlspecialchars($b['customer_name']); ?></p>
                    <div class="space-y-1 text-slate-500 font-semibold text-sm">
                        <p><i class="fa-regular fa-envelope mr-2"></i><?php echo htmlspecialchars($b['user_email']); ?></p>
                        <p><i class="fa-solid fa-phone-flip mr-2"></i><?php echo htmlspecialchars($b['customer_phone']); ?></p>
                    </div>
                </div>
                <div class="md:text-right space-y-3">
                    <h3 class="text-[11px] font-black text-green-600 uppercase tracking-[0.2em] mb-4">Vehicle & Schedule</h3>
                    <p class="font-black text-2xl text-slate-900 uppercase"><?php echo htmlspecialchars($b['car_name']); ?></p>
                    <p class="text-sm font-bold text-slate-400 italic"><?php echo htmlspecialchars($b['color']); ?> &bull; <?php echo htmlspecialchars($b['plate_number']); ?></p>
                    <div class="inline-block bg-slate-100 px-4 py-2 rounded-full mt-4">
                        <p class="text-[10px] font-black text-slate-600 uppercase">
                            <?php echo $pickup; ?> <span class="text-green-600 mx-2">>></span> <?php echo $return; ?>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Table -->
            <div class="rounded-3xl border border-slate-100 overflow-hidden mb-12 shadow-sm">
                <table class="w-full text-left">
                    <thead class="bg-slate-50 border-b border-slate-100">
                        <tr class="text-[10px] uppercase font-black text-slate-400 tracking-widest">
                            <th class="py-5 px-8">Service Description</th>
                            <th class="py-5 px-8 text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                        <tr>
                            <td class="py-10 px-8">
                                <p class="font-black text-slate-900 text-xl">Fleet Rental Services</p>
                                <p class="text-sm text-slate-400 mt-2 font-medium max-w-sm">Comprehensive rental package including mandatory local insurance and 24/7 roadside assistance.</p>
                            </td>
                            <td class="py-10 px-8 text-right align-top">
                                <span class="font-black text-slate-900 text-2xl">K<?php echo number_format($quoted, 2); ?></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Totals & QR -->
            <div class="flex flex-col md:flex-row justify-between items-start gap-12 border-b border-slate-100 pb-14">
                <div class="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 w-full md:w-auto">
                    <div class="bg-white p-3 rounded-2xl shadow-sm">
                        <img src="<?php echo $qrCodeUrl; ?>" alt="Verify" class="w-24 h-24">
                    </div>
                    <div>
                        <p class="text-[11px] font-black uppercase text-slate-900 tracking-tighter">Digital Verification</p>
                        <p class="text-[10px] font-bold text-slate-400 max-w-[140px] mt-2 leading-relaxed">Scan to confirm this document's authenticity on the CityDrive Secure Portal.</p>
                    </div>
                </div>

                <div class="w-full md:w-80 space-y-4">
                    <div class="flex justify-between text-xs font-black uppercase text-slate-400">
                        <span>Total Quoted</span>
                        <span>K<?php echo number_format($quoted, 2); ?></span>
                    </div>
                    <div class="flex justify-between text-xs font-black uppercase text-green-600">
                        <span>Payments Received</span>
                        <span>- K<?php echo number_format($paid, 2); ?></span>
                    </div>
                    <div class="pt-6 border-t-4 border-slate-900 flex justify-between items-center">
                        <span class="font-black text-slate-900 uppercase text-sm tracking-tight">Balance Due</span>
                        <span class="font-black text-4xl text-slate-900 tracking-tighter">K<?php echo number_format($balance, 2); ?></span>
                    </div>
                </div>
            </div>

            <!-- Footer Note -->
            <div class="mt-14 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                    <h4 class="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-4">Rental Terms</h4>
                    <ul class="text-[9px] text-slate-400 font-bold uppercase space-y-2 leading-tight">
                        <li><span class="text-slate-900">01.</span> Vehicles must be returned with a full fuel tank.</li>
                        <li><span class="text-slate-900">02.</span> Late returns incur a charge of K250 per hour.</li>
                        <li><span class="text-slate-900">03.</span> Insurance excess applies to all accidents.</li>
                    </ul>
                </div>
                <div class="md:text-right flex flex-col justify-end no-print">
                    <button onclick="window.print()" class="inline-flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-600 transition-all shadow-xl">
                        <i class="fa-solid fa-file-pdf"></i> Save as Invoice
                    </button>
                </div>
            </div>
            
            <p class="mt-16 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
                Generated by CityDrive Hire &bull; <?php echo date('d M Y | H:i'); ?>
            </p>
        </div>
    </div>
</body>
</html>