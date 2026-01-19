'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { FaEdit, FaTrash, FaPlus, FaEye, FaSpinner, FaCar, FaSearch, FaFilter, FaSortAmountDown } from 'react-icons/fa';

// Define your API base for images
const API_BASE_URL = 'https://api.citydrivehire.com';

export default function CarsPage() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
        async function fetchCars() {
            try {
                const res = await fetch(`${API_BASE_URL}/admin/get_cars.php`);
                const json = await res.json();
                if (json.success) {
                    setCars(json.cars);
                }
            } catch (error) {
                console.error("Failed to fetch cars:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCars();
    }, []);

    // ... (filteredCars and carTypes useMemo logic remains the same)
    const filteredCars = useMemo(() => {
        return cars
            .filter(car => {
                const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                    car.plate_number.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesType = filterType === "All" || car.type === filterType;
                return matchesSearch && matchesType;
            })
            .sort((a, b) => {
                if (sortBy === "price_low") return a.price_per_day - b.price_per_day;
                if (sortBy === "price_high") return b.price_per_day - a.price_per_day;
                if (sortBy === "name") return a.name.localeCompare(b.name);
                return b.id - a.id; 
            });
    }, [cars, searchTerm, filterType, sortBy]);

    const carTypes = useMemo(() => {
        const types = new Set(cars.map(car => car.type));
        return ["All", ...Array.from(types)];
    }, [cars]);

    if (loading) return (
        <div className="flex justify-center items-center h-64 text-green-600">
            <FaSpinner className="animate-spin text-2xl" />
        </div>
    );

    return (
        <div>
            {/* PAGE HEADER & FILTERS (Kept original UI) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Fleet Management</h2>
                    <p className="text-sm text-gray-500">Manage your vehicle inventory for Emit Photography.</p>
                </div>
                <Link href="/admin/cars/new" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all shadow-sm active:scale-95">
                    <FaPlus /> Add Vehicle
                </Link>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                        <tr>
                            <th className="px-6 py-3">Vehicle</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">License Plate</th>
                            <th className="px-6 py-3">Daily Rate</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredCars.map((car) => {
                            let imageUrl = null;
                            try {
                                const images = JSON.parse(car.image_url);
                                if (Array.isArray(images) && images.length > 0) {
                                    // 1. Clean backslashes from PHP/Windows
                                    // 2. Remove leading slashes
                                    const cleanPath = images[0];
                                    // 3. Construct absolute URL to your PHP server
                                    imageUrl = `${API_BASE_URL}/${cleanPath}`;
                                }
                            } catch (e) {
                                imageUrl = null;
                            }

                            return (
                                <tr key={car.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-14 bg-gray-100 rounded md overflow-hidden flex items-center justify-center border border-gray-50">
                                                {imageUrl ? (
                                                    <img 
                                                        src={imageUrl} 
                                                        alt={car.name} 
                                                        className="object-cover h-full w-full"
                                                        onError={(e) => { e.target.src = ""; e.target.className = "hidden"; }} 
                                                    />
                                                ) : (
                                                    <FaCar className="text-gray-300" />
                                                )}
                                            </div>
                                            <Link href={`/admin/cars/${car.id}`} className="font-bold text-gray-900 hover:text-green-600 transition-colors">
                                                {car.name}
                                            </Link>
                                        </div>
                                    </td>
                                    {/* ... rest of your table cells (Type, Plate, Rate, Status, Actions) */}
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">{car.type}</span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs uppercase text-gray-500">{car.plate_number}</td>
                                    <td className="px-6 py-4 font-bold text-gray-700">K{Number(car.price_per_day).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${car.available == 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {car.available == 1 ? 'Available' : 'Unavailable'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/admin/cars/${car.id}`} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"><FaEye /></Link>
                                            <Link href={`/admin/cars/${car.id}/edit`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><FaEdit /></Link>
                                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><FaTrash /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}