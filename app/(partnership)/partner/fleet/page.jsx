'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaCircle, FaCar, FaRoad, FaMoneyBillWave, FaFilter, FaSortAmountDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function PartnerFleetPage() {
    // State for Search, Sort, Filter, and Pagination
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortOption, setSortOption] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Mock Fleet Data
    const fleet = [
        {
            id: 1,
            name: 'Toyota RAV4',
            year: 2021,
            plate: 'ABC 123',
            status: 'Available',
            price: 600,
            trips: 15,
            image: 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
            id: 2,
            name: 'Ford Ranger',
            year: 2020,
            plate: 'XYZ 999',
            status: 'Rented',
            price: 1200,
            trips: 8,
            image: 'https://images.pexels.com/photos/1637859/pexels-photo-1637859.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
            id: 3,
            name: 'Honda Fit',
            year: 2019,
            plate: 'LUS 555',
            status: 'Maintenance',
            price: 450,
            trips: 22,
            image: 'https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
            id: 4,
            name: 'Toyota Hilux',
            year: 2022,
            plate: 'ZMB 882',
            status: 'Available',
            price: 1100,
            trips: 5,
            image: 'https://images.pexels.com/photos/119435/pexels-photo-119435.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
            id: 5,
            name: 'Mercedes C200',
            year: 2018,
            plate: 'ABC 001',
            status: 'Rented',
            price: 900,
            trips: 45,
            image: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
            id: 6,
            name: 'Toyota Vitz',
            year: 2015,
            plate: 'LUS 101',
            status: 'Available',
            price: 350,
            trips: 60,
            image: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
            id: 7,
            name: 'Land Cruiser',
            year: 2023,
            plate: 'BOSS 1',
            status: 'Available',
            price: 2500,
            trips: 2,
            image: 'https://images.pexels.com/photos/3752169/pexels-photo-3752169.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
    ];

    // Filter & Sort Logic
    const processedFleet = useMemo(() => {
        let result = [...fleet];

        // 1. Filter by Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(car =>
                car.name.toLowerCase().includes(query) ||
                car.plate.toLowerCase().includes(query)
            );
        }

        // 2. Filter by Status
        if (statusFilter !== 'all') {
            result = result.filter(car => car.status.toLowerCase() === statusFilter);
        }

        // 3. Sort
        result.sort((a, b) => {
            switch (sortOption) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'trips': return b.trips - a.trips;
                case 'newest': return b.year - a.year;
                default: return 0;
            }
        });

        return result;
    }, [fleet, searchQuery, statusFilter, sortOption]);

    // Pagination Logic
    const totalPages = Math.ceil(processedFleet.length / itemsPerPage);
    const paginatedFleet = processedFleet.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Helper for status colors
    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'text-green-700 bg-green-50 border-green-100';
            case 'Rented': return 'text-blue-700 bg-blue-50 border-blue-100';
            case 'Maintenance': return 'text-red-700 bg-red-50 border-red-100';
            default: return 'text-gray-700 bg-gray-50 border-gray-100';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">

            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Fleet</h1>
                    <p className="text-gray-500 mt-1">
                        Manage your vehicle listings ({processedFleet.length} vehicles found).
                    </p>
                </div>
                <Link
                    href="/partner/add-car"
                    className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-all shadow-sm hover:shadow-md"
                >
                    <FaPlus className="text-sm" /> Add Vehicle
                </Link>
            </div>

            {/* Filters & Search Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-12 gap-4">

                {/* Search */}
                <div className="md:col-span-5 relative">
                    <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        placeholder="Search by name or plate..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                    />
                </div>

                {/* Status Filter */}
                <div className="md:col-span-3 relative">
                    <FaFilter className="absolute left-3 top-3.5 text-gray-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium text-gray-700 appearance-none"
                    >
                        <option value="all">All Status</option>
                        <option value="available">Available</option>
                        <option value="rented">Rented</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                </div>

                {/* Sort */}
                <div className="md:col-span-4 relative">
                    <FaSortAmountDown className="absolute left-3 top-3.5 text-gray-400" />
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium text-gray-700 appearance-none"
                    >
                        <option value="newest">Newest First</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="trips">Most Popular (Trips)</option>
                    </select>
                </div>
            </div>

            {/* Responsive Card Grid */}
            {paginatedFleet.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {paginatedFleet.map((car) => (
                            <div
                                key={car.id}
                                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col"
                            >
                                {/* Top Section: Info Left / Image Right */}
                                <div className="flex justify-between items-start gap-4 mb-4">

                                    {/* LEFT: Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-lg text-gray-900 truncate">{car.name}</h3>
                                        <p className="text-xs font-mono text-gray-500 mb-3">
                                            {car.year} • {car.plate}
                                        </p>

                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(car.status)}`}>
                                            <FaCircle size={6} className={car.status === 'Available' ? "animate-pulse" : ""} /> {car.status}
                                        </span>
                                    </div>

                                    {/* RIGHT: Image Thumbnail */}
                                    <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 shadow-inner">
                                        {car.image ? (
                                            <Image src={car.image} alt={car.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <FaCar size={24} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Middle Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-50 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><FaMoneyBillWave /> Daily Rate</p>
                                        <p className="font-bold text-gray-900">ZMW {car.price}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 mb-1 flex items-center justify-end gap-1"><FaRoad /> Total Trips</p>
                                        <p className="font-bold text-gray-900">{car.trips}</p>
                                    </div>
                                </div>

                                {/* Bottom Actions */}
                                <div className="mt-auto flex items-center gap-2">
                                    <button className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                                        View Details
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="Edit">
                                        <FaEdit size={16} />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Delete">
                                        <FaTrash size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <FaChevronLeft size={12} /> Previous
                            </button>
                            <span className="text-sm text-gray-600">
                                Page <span className="font-bold text-gray-900">{currentPage}</span> of <span className="font-bold text-gray-900">{totalPages}</span>
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next <FaChevronRight size={12} />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-4">
                        <FaCar size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No vehicles found</h3>
                    <p className="text-gray-500 mt-1 mb-6 text-center max-w-sm">
                        Try adjusting your search or filters to find what you're looking for.
                    </p>
                    <button
                        onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                        className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}