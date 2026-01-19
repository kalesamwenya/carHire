'use client';

import { useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import CarCard from './CarCard';
import CarCompare from './CarCompare';

export default function PopularRentalsClient({ initialCars }) {
    const [compareIds, setCompareIds] = useState([]);

    const toggleCompare = (id) => {
        setCompareIds(prev => {
            if (prev.includes(id)) return prev.filter(x => x !== id);
            if (prev.length >= 3) {
                toast.error("You can only compare up to 3 cars.");
                return prev;
            }
            return [...prev, id];
        });
    };

    const selectedCars = useMemo(() => {
        return initialCars.filter(c => compareIds.includes(c.id));
    }, [initialCars, compareIds]);

    if (initialCars.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500">Our fleet is currently being updated.</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {initialCars.map((car) => (
                    <CarCard 
                        key={car.id} 
                        car={car} 
                        onCompare={() => toggleCompare(car.id)}
                        isComparing={compareIds.includes(car.id)}
                    />
                ))}
            </div>

            {/* The floating comparison bar */}
            <CarCompare
                cars={selectedCars}
                onClose={() => setCompareIds([])}
                onRemove={(id) => setCompareIds(prev => prev.filter(x => x !== id))}
            />
        </>
    );
}