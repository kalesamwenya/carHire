import { NextResponse } from 'next/server';

// Mock Data - In production, replace this with a database query (Postgres/MongoDB)
const cars = [
    {
        id: '1',
        name: 'Toyota RAV4',
        type: 'SUV',
        price: 620,
        image: 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg',
        transmission: 'Automatic',
        fuel: 'Petrol',
        seats: 5,
        available: true,
        featured: true,
        description: 'A reliable and spacious SUV perfect for both city driving and off-road adventures.'
    },
    {
        id: '2',
        name: 'Mercedes C-Class',
        type: 'Sedan',
        price: 950,
        image: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg',
        transmission: 'Automatic',
        fuel: 'Diesel',
        seats: 5,
        available: true,
        featured: true,
        description: 'Experience luxury and comfort with this premium sedan. Ideal for business trips.'
    },
    {
        id: '3',
        name: 'Ford Ranger',
        type: 'Truck',
        price: 1200,
        image: 'https://images.pexels.com/photos/1637859/pexels-photo-1637859.jpeg',
        transmission: 'Manual',
        fuel: 'Diesel',
        seats: 5,
        available: false,
        featured: false,
        description: 'Built for tough terrain. This 4x4 pickup will get you anywhere you need to go in Zambia.'
    },
    {
        id: '4',
        name: 'Toyota HiAce',
        type: 'Van',
        price: 800,
        image: 'https://images.pexels.com/photos/2085737/pexels-photo-2085737.jpeg',
        transmission: 'Manual',
        fuel: 'Diesel',
        seats: 12,
        available: true,
        featured: false,
        description: 'Spacious van for group travel. Reliable transport for tours and large families.'
    },
    {
        id: '5',
        name: 'Honda Fit',
        type: 'Hatchback',
        price: 450,
        image: 'https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg',
        transmission: 'Automatic',
        fuel: 'Petrol',
        seats: 4,
        available: true,
        featured: true,
        description: 'Compact and fuel-efficient. The perfect choice for navigating Lusaka traffic.'
    }
];

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const id = searchParams.get('id'); // Support getting multiple by IDs if needed

    let filtered = [...cars];

    // Filter by Featured
    if (featured === 'true') {
        filtered = filtered.filter(c => c.featured);
    }

    // Limit results
    if (limit) {
        filtered = filtered.slice(0, parseInt(limit));
    }

    return NextResponse.json(filtered);
}