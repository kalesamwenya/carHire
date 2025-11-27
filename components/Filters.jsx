// components/Filters.jsx
'use client';

import { useState, useEffect } from 'react';
import { FaFilter, FaTimes, FaMoneyBillWave, FaCar, FaCogs, FaGasPump } from 'react-icons/fa';

export default function Filters({ onChange, activeFilters = {} }) {
    // Local state to manage UI, but we sync with parent via useEffect/props if needed
    // In this simple version, we rely on parent passing 'activeFilters' to keep sync or just local
    
    const handleChange = (key, value) => {
        const next = { ...activeFilters, [key]: value };
        // Clean up empty keys
        if (value === '' || value === false) {
            delete next[key];
        }
        onChange(next);
    };

    const handleReset = () => {
        onChange({});
    };

    // Helper to check if any filter is active
    const hasActiveFilters = Object.keys(activeFilters).length > 0;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <FaFilter className="text-green-600" /> Filters
                </h3>
                {hasActiveFilters && (
                    <button 
                        onClick={handleReset}
                        className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
                    >
                        <FaTimes /> Clear
                    </button>
                )}
            </div>

            <div className="space-y-6">
                
                {/* 1. Price Range (Slider) */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <FaMoneyBillWave className="text-gray-400" /> Max Price (Daily)
                    </label>
                    <input 
                        type="range" 
                        min="0" 
                        max="5000" 
                        step="100"
                        value={activeFilters.maxPrice || 5000}
                        onChange={(e) => handleChange('maxPrice', e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>ZMW 0</span>
                        <span className="font-bold text-green-700">
                            {activeFilters.maxPrice ? `ZMW ${activeFilters.maxPrice}` : 'Any Price'}
                        </span>
                    </div>
                </div>

                {/* 2. Car Type (Chips) */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <FaCar className="text-gray-400" /> Vehicle Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {['Sedan', 'SUV', 'Van', 'Truck'].map((type) => {
                            const isActive = activeFilters.type === type;
                            return (
                                <button
                                    key={type}
                                    onClick={() => handleChange('type', isActive ? '' : type)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                                        isActive 
                                        ? 'bg-green-100 border-green-600 text-green-800' 
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-green-400'
                                    }`}
                                >
                                    {type}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 3. Transmission (Select) */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FaCogs className="text-gray-400" /> Transmission
                    </label>
                    <select 
                        value={activeFilters.transmission || ''}
                        onChange={(e) => handleChange('transmission', e.target.value)}
                        className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-gray-50"
                    >
                        <option value="">Any Transmission</option>
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                    </select>
                </div>

                {/* 4. Fuel Type (Select) */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FaGasPump className="text-gray-400" /> Fuel Type
                    </label>
                    <select 
                        value={activeFilters.fuel || ''}
                        onChange={(e) => handleChange('fuel', e.target.value)}
                        className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-gray-50"
                    >
                        <option value="">Any Fuel</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Electric">Electric</option>
                    </select>
                </div>

                {/* 5. Availability (Toggle Switch) */}
                <div className="pt-2 border-t border-gray-100">
                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm font-medium text-gray-700 group-hover:text-green-700 transition-colors">
                            Show Available Only
                        </span>
                        <div className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer"
                                checked={!!activeFilters.availableOnly}
                                onChange={(e) => handleChange('availableOnly', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
}