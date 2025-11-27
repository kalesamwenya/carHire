// app/cars/page.jsx  (Server Component)
import CarListClient from '../../components/CarListClient';

export default async function CarsPage() {
    const res = await fetch(new URL('/api/cars', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').toString(), { cache: 'no-store' });
    const cars = await res.json();
    return <CarListClient cars={cars} />;
}
