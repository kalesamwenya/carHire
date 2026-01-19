'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
    FaPlus, FaSearch, FaEdit, FaTrash, FaCircle, 
    FaCar, FaRoad, FaMoneyBillWave, FaFilter, 
    FaSortAmountDown, FaChevronLeft, FaChevronRight 
} from 'react-icons/fa';

export default function PartnerFleetPage() {
    const { data: session } = useSession();
    const [fleet, setFleet] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // UI State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortOption, setSortOption] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const Public_Api = "https://api.citydrivehire.com";

    // 1. Fetch Real Data
    useEffect(() => {
        const fetchFleet = async () => {
            if (!session?.user?.id) return;
            try {
                // Pointing to your updated get-fleet.php
                const res = await fetch(`${Public_Api}/partners/get-fleet.php?user_id=${session.user.id}`);
                const data = await res.json();
                if (data.success) {
                    setFleet(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch fleet:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFleet();
    }, [session]);

    // 2. Filter & Sort Logic
    const processedFleet = useMemo(() => {
        let result = [...fleet];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(car =>
                car.name.toLowerCase().includes(query) ||
                car.plate.toLowerCase().includes(query)
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter(car => car.status?.toLowerCase() === statusFilter);
        }

        result.sort((a, b) => {
            switch (sortOption) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'trips': return (b.trips || 0) - (a.trips || 0);
                case 'newest': return b.id - a.id; // Assuming higher ID is newer
                default: return 0;
            }
        });

        return result;
    }, [fleet, searchQuery, statusFilter, sortOption]);

    // 3. Pagination Logic
    const totalPages = Math.ceil(processedFleet.length / itemsPerPage);
    const paginatedFleet = processedFleet.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

   const getStatusColor = (status) => {
    switch (status) {
        case 'Available': 
            return 'text-green-700 bg-green-50 border-green-100';
        case 'Booked': 
            return 'text-blue-700 bg-blue-50 border-blue-100';
        case 'Maintenance': 
            return 'text-orange-700 bg-orange-50 border-orange-100';
        default: 
            return 'text-gray-700 bg-gray-50 border-gray-100';
    }
};

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading your fleet...</p>
        </div>
    );

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

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-12 gap-4">
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

            {/* Fleet Grid */}
            {paginatedFleet.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {paginatedFleet.map((car) => (
                            <div key={car.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col">
                                <div className="flex justify-between items-start gap-4 mb-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-lg text-gray-900 truncate">{car.name}</h3>
                                        <p className="text-xs font-mono text-gray-500 mb-3">{car.plate}</p>
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(car.status || 'Available')}`}>
                                            <FaCircle size={6} className={car.status === 'Available' ? "animate-pulse" : ""} /> {car.status || 'Available'}
                                        </span>
                                    </div>

                                    <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 shadow-inner">
                                        {car.image ? (
                                            <img 
                                                src={`${Public_Api}/public/${car.image}`} 
                                                alt={car.name} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <FaCar size={24} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-50 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><FaMoneyBillWave /> Daily Rate</p>
                                        <p className="font-bold text-gray-900 text-sm">ZMW {parseFloat(car.price).toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 mb-1 flex items-center justify-end gap-1"><FaRoad /> Total Trips</p>
                                        <p className="font-bold text-gray-900 text-sm">{car.trips || 0}</p>
                                    </div>
                                </div>

                                <div className="mt-auto flex items-center gap-2">
                                    <Link 
                                        href={`/partner/fleet/${car.id}`} 
                                        className="flex-1 py-2 text-center text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                                    >
                                        View Details
                                    </Link>
                                    <Link href={`/partner/fleet/${car.id}/edit`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                                        <FaEdit size={16} />
                                    </Link>
                                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100">
                                        <FaTrash size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                                disabled={currentPage === 1} 
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                <FaChevronLeft size={12} /> Previous
                            </button>
                            <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                                disabled={currentPage === totalPages} 
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                Next <FaChevronRight size={12} />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-4"><FaCar size={28} /></div>
                    <h3 className="text-lg font-bold text-gray-900">No vehicles found</h3>
                    <p className="text-gray-500 mt-1 mb-6 text-center max-w-sm">Try adjusting your filters or add your first vehicle for **Emit Photography**.</p>
                    <button onClick={() => { setSearchQuery(''); setStatusFilter('all'); }} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors">Clear Filters</button>
                </div>
            )}
        </div>
    );
}