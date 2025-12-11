'use client';

import { useState, useMemo } from 'react';
import { FaFilter, FaSadTear } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import CarCard from './CarCard';
import Filters from './Filters';
import CarCompare from './CarCompare';

export default function CarListClient({ cars = [] }) {
    const [filters, setFilters] = useState({});
    const [compareIds, setCompareIds] = useState([]); // Store IDs only
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Toggle Logic
    const toggleCompare = (id, e) => {
        // Prevent clicking the card link if the button is inside one
        if(e) { e.preventDefault(); e.stopPropagation(); }

        setCompareIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(x => x !== id);
            }
            if (prev.length >= 3) {
                toast.error("You can only compare up to 3 cars.");
                return prev;
            }
            return [...prev, id];
        });
    };

    // Remove Logic
    const removeFromCompare = (id) => {
        setCompareIds(prev => prev.filter(x => x !== id));
    };

    // Derived State: Get the actual car objects for the comparison widget
    // This removes the need for CarCompare to fetch data!
    const selectedCars = useMemo(() => {
        return cars.filter(c => compareIds.includes(c.id));
    }, [cars, compareIds]);

    // Filter Logic
    const filtered = useMemo(() => {
        return cars.filter(c => {
            if (filters.type && c.type !== filters.type) return false;
            if (filters.transmission && c.transmission !== filters.transmission) return false;
            if (filters.fuel && c.fuel !== filters.fuel) return false;
            if (filters.maxPrice && c.price > Number(filters.maxPrice)) return false;
            if (filters.availableOnly && !c.available) return false;
            return true;
        });
    }, [cars, filters]);

    return (
        <div className="relative">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
                <button 
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium shadow-sm w-full justify-center"
                >
                    <FaFilter className="text-green-600" />
                    {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <aside className={`lg:w-72 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                    <div className="sticky top-24">
                        <Filters onChange={setFilters} activeFilters={filters} />
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-xl font-bold text-gray-900">
                            Available Vehicles
                            <span className="ml-2 text-sm font-normal text-gray-500">({filtered.length} found)</span>
                        </h1>
                    </div>

                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filtered.map(car => (
                                <CarCard 
                                    key={car.id} 
                                    car={car} 
                                    onCompare={(e) => toggleCompare(car.id, e)} 
                                    isComparing={compareIds.includes(car.id)} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
                            <FaSadTear className="mx-auto text-4xl text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No cars found</h3>
                            <button onClick={() => setFilters({})} className="mt-6 text-green-700 font-medium hover:underline">
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Comparison Widget - Passing the OBJECTS now, not just IDs */}
            <CarCompare 
                cars={selectedCars} 
                onClose={() => setCompareIds([])} 
                onRemove={removeFromCompare} 
            />
        </div>
    );
}