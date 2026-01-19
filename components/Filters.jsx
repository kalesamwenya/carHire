'use client';

import { FaCar, FaCogs, FaGasPump, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';

export default function Filters({ onChange, activeFilters }) {
    
    const handleFilterChange = (key, value) => {
        onChange({ ...activeFilters, [key]: value === "" ? null : value });
    };

    const inputStyle = "w-full bg-gray-100 border-none rounded-xl p-3 text-sm font-semibold focus:ring-2 focus:ring-green-500 transition-all outline-none text-gray-700";
    const labelStyle = "text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2";

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-8">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Refine Search</h3>
                <p className="text-xs text-gray-400 mb-6">Find the perfect ride for Emit Photography</p>
            </div>

            {/* Vehicle Type */}
            <div className="space-y-2">
                <label className={labelStyle}><FaCar /> Vehicle Type</label>
                <select 
                    className={inputStyle}
                    value={activeFilters.type || ""}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                    <option value="">All Types</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Pickup">Pickup</option>
                </select>
            </div>

            {/* Transmission */}
            <div className="space-y-2">
                <label className={labelStyle}><FaCogs /> Transmission</label>
                <select 
                    className={inputStyle}
                    value={activeFilters.transmission || ""}
                    onChange={(e) => handleFilterChange('transmission', e.target.value)}
                >
                    <option value="">Any</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                </select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
                <label className={labelStyle}><FaMoneyBillWave /> Max Price (ZMW)</label>
                <input 
                    type="range" 
                    min="500" 
                    max="10000" 
                    step="100"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    value={activeFilters.maxPrice || 10000}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
                <div className="flex justify-between text-[11px] font-bold text-gray-500 mt-1">
                    <span>500</span>
                    <span className="text-green-600">Up to {activeFilters.maxPrice || 10000}</span>
                </div>
            </div>

            {/* Availability Toggle */}
            <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                    <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={!!activeFilters.availableOnly}
                        onChange={(e) => handleFilterChange('availableOnly', e.target.checked)}
                    />
                    <div className={`w-10 h-5 rounded-full transition-colors ${activeFilters.availableOnly ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    <div className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform ${activeFilters.availableOnly ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
                <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">Available Only</span>
            </label>

            {/* Clear Button */}
            <button 
                onClick={() => onChange({})}
                className="w-full py-3 text-xs font-bold text-gray-400 hover:text-red-500 border border-dashed border-gray-200 rounded-xl transition-all"
            >
                Clear All Filters
            </button>
        </div>
    );
}