import { NextResponse } from 'next/server';

// Populated Mock Database with various statuses
let bookings = [
    {
        booking_id: 'BK-1A2B3C',
        car_id: '1',
        car_name: 'Toyota RAV4',
        user_name: 'Kaleb Mwenya',
        from: '2023-10-01',
        to: '2023-10-05',
        total: 3100,
        status: 'completed',
        payment_status: 'paid',
        created_at: '2023-09-28T10:00:00Z'
    },
    {
        booking_id: 'BK-9X8Y7Z',
        car_id: '4',
        car_name: 'Toyota HiAce',
        user_name: 'Kaleb Mwenya',
        from: '2023-11-15',
        to: '2023-11-20',
        total: 4000,
        status: 'completed',
        payment_status: 'paid',
        created_at: '2023-11-10T14:30:00Z'
    },
    {
        booking_id: 'BK-4M5N6O',
        car_id: '2',
        car_name: 'Mercedes C-Class',
        user_name: 'Kaleb Mwenya',
        from: '2025-12-01',
        to: '2025-12-03',
        total: 1900,
        status: 'upcoming',
        payment_status: 'paid',
        created_at: '2025-11-25T09:15:00Z'
    },
    {
        booking_id: 'BK-PEND01',
        car_id: '3',
        car_name: 'Ford Ranger',
        user_name: 'Kaleb Mwenya',
        from: '2025-12-10',
        to: '2025-12-15',
        total: 6000,
        status: 'pending', // Useful for partner approval flows
        payment_status: 'unpaid',
        created_at: '2025-12-01T08:00:00Z'
    }
];

export async function POST(request) {
    try {
        const body = await request.json();
        const { car_id, name, phone, from, to, total_price } = body;

        if (!car_id || !name || !phone || !from || !to) {
            return NextResponse.json(
                { message: 'Missing required booking details.' },
                { status: 400 }
            );
        }

        // Simulate Processing Delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const bookingId = `BK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // In a real app, you would look up the car name here
        const carName = `Vehicle ${car_id}`;

        const newBooking = {
            booking_id: bookingId,
            car_id,
            car_name: carName,
            user_name: name,
            from,
            to,
            total: total_price,
            status: 'upcoming',
            payment_status: 'paid',
            created_at: new Date().toISOString()
        };

        bookings.unshift(newBooking); // Add to top of list

        return NextResponse.json(
            {
                success: true,
                booking_id: bookingId,
                status: 'confirmed',
                message: 'Booking confirmed successfully.'
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Booking Error:', error);
        return NextResponse.json(
            { message: 'Internal server error.' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json(bookings);
}