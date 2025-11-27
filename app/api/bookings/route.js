import { NextResponse } from 'next/server';

// Mock database for demonstration
let bookings = [];

export async function POST(request) {
    try {
        const body = await request.json();
        const { car_id, name, phone, from, to, total_price, duration_days } = body;

        // 1. Server-side Validation
        if (!car_id || !name || !phone || !from || !to) {
            return NextResponse.json(
                { message: 'Missing required booking details.' },
                { status: 400 }
            );
        }

        // 2. Simulate Payment Processing (e.g., Stripe/PayPal)
        // In a real app, you would charge the card token here.
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay to mimic bank transaction

        // 3. Generate Booking Artifacts
        const bookingId = `BK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        const newBooking = {
            booking_id: bookingId,
            car_id,
            user_name: name,
            dates: { from, to },
            total: total_price,
            status: 'confirmed',
            payment_status: 'paid',
            created_at: new Date().toISOString()
        };

        // Save to mock DB
        bookings.push(newBooking);

        // 4. Return Confirmation
        return NextResponse.json(
            { 
                success: true, 
                booking_id: bookingId, 
                status: 'confirmed',
                message: 'Payment successful and booking confirmed.' 
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Booking Error:', error);
        return NextResponse.json(
            { message: 'Internal server error processing payment.' },
            { status: 500 }
        );
    }
}

export async function GET() {
    // Return all bookings (for the dashboard)
    return NextResponse.json(bookings);
}