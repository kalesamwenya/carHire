// File utils/generateBookingReceipt.js
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import axios from 'axios';

export async function generateBookingReceipt({ tx_ref, amount, customer, car, dates, booking_id }) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const width = doc.internal.pageSize.width;
    const height = doc.internal.pageSize.height;
    
    // Brand Colors
    const slateDark = [15, 23, 42];  // Slate-900
    const driveGreen = [22, 163, 74]; // Green-600
    const lightSlate = [148, 163, 184]; // Slate-400
    
    // --- 1. WATERMARK (Background) ---
    doc.setTextColor(240, 240, 240);
    doc.setFontSize(80);
    doc.setFont("helvetica", "bold");
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.1 }));
    doc.text('CITYDRIVE', width / 2, height / 2, { align: 'center', angle: 45 });
    doc.restoreGraphicsState();

    // --- 2. PREMIUM HEADER ---
    doc.setFillColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.rect(0, 0, width, 140, 'F');

    // Logo
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text('CITY', 50, 70);
    doc.setTextColor(driveGreen[0], driveGreen[1], driveGreen[2]);
    doc.text('DRIVE', 115, 70);

    doc.setFontSize(10);
    doc.setTextColor(lightSlate[0], lightSlate[1], lightSlate[2]);
    doc.text('PREMIUM VEHICLE RENTALS', 50, 88);

    // Invoice Label
    doc.setFontSize(9);
    doc.text('OFFICIAL RECEIPT', width - 50, 60, { align: 'right' });
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text(`#${booking_id}`, width - 50, 85, { align: 'right' });

    // --- 3. STATUS STAMP ---
    doc.setDrawColor(driveGreen[0], driveGreen[1], driveGreen[2]);
    doc.setLineWidth(2);
    doc.setTextColor(driveGreen[0], driveGreen[1], driveGreen[2]);
    doc.rect(width - 130, 100, 80, 25);
    doc.setFontSize(14);
    doc.text('PAID IN FULL', width - 90, 118, { align: 'center' });

    let y = 180;

    // --- 4. DETAILS GRID ---
    doc.setFontSize(8);
    doc.setTextColor(driveGreen[0], driveGreen[1], driveGreen[2]);
    doc.text('RENTER INFORMATION', 50, y);
    doc.text('VEHICLE & JOURNEY', 300, y);

    y += 20;
    doc.setFontSize(12);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.setFont("helvetica", "bold");
    doc.text(customer.name.toUpperCase(), 50, y);
    doc.text(car.name.toUpperCase(), 300, y);

    y += 16;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text([
        `Tel: ${customer.phone}`, 
        `Email: ${customer.email || 'N/A'}`, 
        `License: ${customer.license}`
    ], 50, y);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text(`${dates.from} - ${dates.to}`, 300, y);
    doc.setFont("helvetica", "normal");
    doc.text([
        `Transmission: ${car.transmission || 'Automatic'}`,
        `Ref: ${tx_ref}`
    ], 300, y + 14);

    y += 80;

    // --- 5. FINANCIAL TABLE ---
    doc.setFillColor(245, 247, 249);
    doc.rect(50, y, width - 100, 35, 'F');
    
    doc.setFontSize(8);
    doc.setTextColor(lightSlate[0], lightSlate[1], lightSlate[2]);
    doc.text('ITEM DESCRIPTION', 65, y + 21);
    doc.text('TOTAL PAID (ZMW)', width - 65, y + 21, { align: 'right' });

    y += 35;
    doc.setFontSize(11);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.setFont("helvetica", "bold");
    doc.text(`Professional Car Hire Service - ${car.name}`, 65, y + 30);
    
    doc.setFontSize(16);
    doc.setTextColor(driveGreen[0], driveGreen[1], driveGreen[2]);
    doc.text(`K${parseFloat(amount).toLocaleString()}`, width - 65, y + 30, { align: 'right' });
    
    doc.setDrawColor(230, 230, 230);
    doc.line(50, y + 55, width - 50, y + 55);

    y += 100;

    // --- 6. QR VERIFICATION SECTION ---
    const verifyUrl = `https://citydrivehire.com/verify/${booking_id}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        color: { dark: '#0f172a', light: '#ffffff' },
        margin: 1
    });

    doc.setDrawColor(240, 240, 240);
    doc.roundedRect(50, y, 240, 90, 10, 10, 'S');
    doc.addImage(qrDataUrl, 'PNG', 65, y + 15, 60, 60);

    doc.setFontSize(10);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.setFont("helvetica", "bold");
    doc.text('SECURE VERIFICATION', 135, y + 35);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(['This is a digital record.', 'Scan to verify validity', 'on citydrivehire.com'], 135, y + 50);

    // --- 7. AGREEMENT NOTES ---
    y += 130;
    doc.setFontSize(8);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.setFont("helvetica", "bold");
    doc.text('IMPORTANT RENTAL TERMS:', 50, y);
    
    doc.setFontSize(7);
    doc.setTextColor(140);
    doc.setFont("helvetica", "normal");
    const terms = [
        "• Return vehicle with the same fuel level to avoid refueling surcharges.",
        "• Renter is responsible for all traffic fines and toll fees during the period.",
        "• Late returns exceeding 120 minutes will be billed as an additional full day.",
        "• Vehicle must remain within Zambian borders unless specified otherwise."
    ];
    doc.text(terms, 50, y + 15);

    // --- 8. CLEAN CITYDRIVE FOOTER ---
    const footerY = height - 50;
    doc.setDrawColor(240, 240, 240);
    doc.line(50, footerY - 15, width - 50, footerY - 15);

    doc.setFontSize(8);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.setFont("helvetica", "bold");
    doc.text('CITYDRIVE HIRE ZAMBIA', width / 2, footerY, { align: 'center' });
    
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(lightSlate[0], lightSlate[1], lightSlate[2]);
    doc.text('Plot 1234, Lusaka, Zambia | +260 972 338 115 | support@citydrivehire.com', width / 2, footerY + 12, { align: 'center' });

    // --- 9. UPLOAD & SAVE ---
    const pdfBase64 = doc.output('datauristring').split(',')[1];
    const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";
    try {
        await axios.post(`${BASE_API}/bookings/upload_receipt.php`, {
            booking_id,
            pdf_base64,
            email: customer.email,
            name: customer.name
        });
    } catch (error) {
    console.error("Upload failed details:", {
        message: error.message,
        response: error.response?.data, // This shows the PHP error
        status: error.response?.status
    });
}

    doc.save(`CityDrive_Receipt_${booking_id}.pdf`);
}