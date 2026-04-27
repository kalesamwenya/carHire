export const dynamic = 'force-dynamic';
import CarListClient from '../../../components/CarListClient';

export default async function CarsPage() {
    // Local API Endpoint
    const Public_Api = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    try {
        const res = await fetch(`${Public_Api}/cars/get-cars.php`, { 
            cache: 'no-store' 
        });

        if (!res.ok) throw new Error("Failed to fetch data");
        
        const rawCars = await res.json();

        const carsWithPaths = rawCars.map(car => {
            let fullImageUrl = null;
            
            if (car.image) {
                // Remove leading slash to prevent double slashes (//) in the URL
                const cleanPath = car.image.replace(/^\//, '');
                
                // Construct the full URL using the API domain
                fullImageUrl = `${Public_Api}/${cleanPath}`;
            }

            return {
                ...car,
                image: fullImageUrl,
                // Ensure numeric fields are correctly typed for Client-side filters
                price: parseFloat(car.price),
                min_booking_days: parseInt(car.min_booking_days) || 1,
                seats: parseInt(car.seats) || 0
            };
        });

        return (
            <main className="mt-[6rem] mb-[4rem] px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto min-h-screen">
                <header className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Our Fleet</h1>
                    <p className="text-gray-500 mt-2">Professional rentals for Every Occasion.</p>
                </header>

                <CarListClient cars={carsWithPaths} />
            </main>
        );

    } catch (error) {
        console.error("Error loading cars:", error);
        return (
            <div className="mt-20 px-4 max-w-[1440px] mx-auto text-center">
                <h2 className="text-xl font-semibold">Unable to load fleet</h2>
                <p className="text-gray-500">Please check your connection or try again later.</p>
                {/* Passing an empty array prevents the client component from breaking */}
                <CarListClient cars={[]} />
            </div>
        );
    }
}