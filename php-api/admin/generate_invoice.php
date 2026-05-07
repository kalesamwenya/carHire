<?php
require_once '../config/origin.php';
require_once '../config/config.php';
$pdo = getDB();

$id = $_GET['id'] ?? null;
$bookingId = str_replace('INV-', '', $id);

// The Master Query
$sql = "SELECT 
            b.*, 
            c.name AS car_name, c.plate_number, c.color,
            u.phone AS user_phone, u.email AS user_email,
            p.amount_paid, p.transaction_code, p.payment_method, p.payment_status AS p_status
        FROM bookings b
        INNER JOIN cars c ON b.car_id = c.id
        INNER JOIN users u ON b.user_id = u.id
        LEFT JOIN payments p ON b.id = p.booking_id
        WHERE b.booking_id = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$bookingId]);
$b = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$b) { die("Error: Invoice not found in CityDrive Hire system."); }

// Financial Math
$quoted = (float)$b['total_price'];
$paid = (float)($b['amount_paid'] ?? 0);
$balance = $quoted - $paid;
$isPaidInFull = ($paid >= $quoted);

$pickup = date('D, M d, Y', strtotime($b['pickup_date']));
$return = date('D, M d, Y', strtotime($b['return_date']));

// UPDATED DESTINATION FOR QR CODE
$verifyUrl = "https://citydrivehire.com/verify/" . $bookingId;
$qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" . urlencode($verifyUrl);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CityDrive Invoice #<?php echo $id; ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        @media print { .no-print { display: none !important; } }
        .watermark { 
            position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 10rem; font-weight: 900; opacity: 0.08; pointer-events: none; text-transform: uppercase;
        }
    </style>
</head>
<body class="bg-gray-100 p-5 md:p-10 font-sans leading-relaxed">
    <div class="max-w-4xl mx-auto bg-white shadow-2xl rounded-[2.5rem] overflow-hidden relative border border-gray-200">
        
        <?php if($isPaidInFull): ?>
            <div class="watermark text-green-600">PAID</div>
        <?php endif; ?>

        <div class="bg-slate-900 p-10 text-white flex flex-col md:flex-row justify-between items-center">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                    <i class="fa-solid fa-car-side text-xl text-green-600"></i>
                </div>
                <div>
                    <h1 class="text-2xl font-black tracking-tighter">City<span class="text-green-500">Drive</span></h1>
                    <p class="text-[9px] uppercase tracking-[0.3em] font-bold text-slate-400">Premium Car Hire</p>
                </div>
            </div>
            <div class="text-center md:text-right mt-6 md:mt-0">
                <p class="text-[10px] uppercase font-black opacity-50">Invoice #</p>
                <p class="text-2xl font-mono text-green-400 font-bold"><?php echo $id; ?></p>
            </div>
        </div>

        <div class="p-8 md:p-12">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                <div class="space-y-2">
                    <h3 class="text-[10px] font-black text-green-600 uppercase tracking-widest mb-4">Customer Details</h3>
                    <p class="font-black text-xl text-slate-900"><?php echo htmlspecialchars($b['customer_name']); ?></p>
                    <p class="text-sm text-slate-500 font-medium"><?php echo $b['user_email']; ?></p>
                    <p class="text-sm text-slate-500 font-medium"><?php echo $b['customer_phone']; ?></p>
                </div>
                <div class="md:text-right space-y-2">
                    <h3 class="text-[10px] font-black text-green-600 uppercase tracking-widest mb-4">Rental Logistics</h3>
                    <p class="font-black text-xl text-slate-900 uppercase"><?php echo $b['car_name']; ?></p>
                    <p class="text-sm font-bold text-slate-500 italic"><?php echo $b['color']; ?> — <?php echo $b['plate_number']; ?></p>
                    <p class="text-xs font-black text-slate-400 mt-2 uppercase tracking-tighter">
                        <?php echo $pickup; ?> <span class="text-green-600 px-2">TO</span> <?php echo $return; ?>
                    </p>
                </div>
            </div>

            <div class="border border-slate-100 rounded-3xl overflow-hidden mb-10 shadow-sm">
                <table class="w-full">
                    <thead class="bg-slate-50">
                        <tr class="text-[10px] uppercase font-black text-slate-400">
                            <th class="py-4 px-6 text-left">Description</th>
                            <th class="py-4 px-6 text-right">Total (ZMW)</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                        <tr>
                            <td class="py-8 px-6">
                                <p class="font-black text-slate-900 text-lg">Standard Hire Package</p>
                                <p class="text-xs text-slate-400 mt-1">Daily rental rate including limited liability insurance.</p>
                            </td>
                            <td class="py-8 px-6 text-right font-black text-slate-900 text-xl">K<?php echo number_format($quoted, 2); ?></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="flex flex-col md:flex-row justify-between items-start gap-12 border-b border-slate-100 pb-12">
                <div class="flex items-center gap-6 p-5 bg-green-50 rounded-3xl border border-green-100 w-full md:w-auto">
                    <div class="bg-white p-2 rounded-xl shadow-inner">
                        <img src="<?php echo $qrCodeUrl; ?>" alt="Scan to Verify" class="w-24 h-24 block" style="display: block !important; visibility: visible !important;">
                    </div>
                    <div>
                        <p class="text-[10px] font-black uppercase text-green-700">Digital Receipt</p>
                        <p class="text-[10px] font-bold text-green-600/70 max-w-[120px] mt-1 leading-tight uppercase tracking-tight">Scan this code to verify rental authenticity on your mobile.</p>
                    </div>
                </div>

                <div class="w-full md:w-72 space-y-4">
                    <div class="flex justify-between text-sm font-bold uppercase tracking-tighter text-slate-400">
                        <span>Quoted Price</span>
                        <span>K<?php echo number_format($quoted, 2); ?></span>
                    </div>
                    <div class="flex justify-between text-sm font-bold uppercase tracking-tighter text-green-600">
                        <span>Amount Paid</span>
                        <span>- K<?php echo number_format($paid, 2); ?></span>
                    </div>
                    <div class="pt-5 border-t-4 border-slate-900 flex justify-between items-center">
                        <span class="font-black text-slate-900 uppercase text-xs">Due Balance</span>
                        <span class="font-black text-3xl text-slate-900 tracking-tighter">K<?php echo number_format($balance, 2); ?></span>
                    </div>
                </div>
            </div>

            <div class="mt-10">
                <h4 class="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4">Terms & Rental Agreement</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-[9px] text-slate-400 font-bold uppercase leading-relaxed">
                    <p><span class="text-slate-900 mr-1">01. FUEL POLICY:</span> Vehicle must be returned with the same level of fuel as provided at pickup. A refilling fee applies otherwise.</p>
                    <p><span class="text-slate-900 mr-1">02. INSURANCE:</span> Rental includes basic insurance. Client is liable for the first K5,000 of any damage excess unless CDW is purchased.</p>
                    <p><span class="text-slate-900 mr-1">03. LATE RETURN:</span> Returns exceeding the agreed time by 2 hours will incur a full day's charge.</p>
                    <p><span class="text-slate-900 mr-1">04. TRAFFIC FINES:</span> All traffic violations and fines incurred during the rental period are the sole responsibility of the renter.</p>
                </div>
            </div>

            <div class="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 opacity-80 border-t border-slate-50 pt-8">
                <p class="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    Generated by CityDrive Hire Admin • <?php echo date('d M Y, H:i'); ?>
                </p>
                <div class="flex gap-4 no-print">
                    <button onclick="window.print()" class="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 transition-all shadow-xl">
                        Download PDF
                    </button>
                </div>
            </div>
        </div>
    </div>
</body>
</html>