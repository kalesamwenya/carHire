'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaTimes, FaCheckCircle, FaMinusCircle, FaCarSide } from 'react-icons/fa';

export default function CarCompare({ cars = [], onClose, onRemove }) {
    
    // If no cars selected, don't render anything
    if (!cars || cars.length === 0) return null;

    return (
        <aside className="fixed inset-x-0 bottom-0 z-50 flex justify-center pointer-events-none p-4">
            {/* Pointer events auto re-enables clicking inside the modal */}
            <div className="bg-white pointer-events-auto w-full max-w-5xl rounded-t-xl shadow-2xl border border-gray-200 flex flex-col max-h-[80vh] animate-slide-up">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                            {cars.length}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Vehicle Comparison</h3>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Content Table */}
                <div className="overflow-auto custom-scrollbar p-6 bg-white">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="sticky left-0 z-10 bg-white p-4 w-40 min-w-[160px] border-b border-gray-100 text-sm font-bold text-gray-500 uppercase tracking-wider">
                                    Features
                                </th>
                                {cars.map((c) => (
                                    <th key={c.id} className="p-4 min-w-[240px] border-b border-gray-100 align-top">
                                        <div className="relative">
                                            <button 
                                                onClick={() => onRemove(c.id)}
                                                className="absolute -top-2 -right-2 text-gray-300 hover:text-red-500 transition-colors z-20 bg-white rounded-full shadow-sm"
                                                title="Remove"
                                            >
                                                <FaMinusCircle size={24} />
                                            </button>
                                            
                                            <div className="relative h-32 w-full rounded-lg overflow-hidden mb-3 bg-gray-100">
                                                {c.image ? (
                                                    <Image src={c.image} alt={c.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400"><FaCarSide size={30} /></div>
                                                )}
                                            </div>
                                            <div className="font-bold text-lg text-gray-900">{c.name}</div>
                                            <div className="text-green-700 font-bold">ZMW {c.price} <span className="text-xs text-gray-500 font-normal">/ day</span></div>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
                            <tr>
                                <td className="sticky left-0 bg-white p-4 font-semibold text-gray-900">Transmission</td>
                                {cars.map(c => <td key={c.id} className="p-4 text-center">{c.transmission}</td>)}
                            </tr>
                            <tr>
                                <td className="sticky left-0 bg-white p-4 font-semibold text-gray-900">Fuel Type</td>
                                {cars.map(c => <td key={c.id} className="p-4 text-center">{c.fuel}</td>)}
                            </tr>
                            <tr>
                                <td className="sticky left-0 bg-white p-4 font-semibold text-gray-900">Category</td>
                                {cars.map(c => <td key={c.id} className="p-4 text-center">{c.type}</td>)}
                            </tr>
                            <tr>
                                <td className="sticky left-0 bg-white p-4 font-semibold text-gray-900">Status</td>
                                {cars.map(c => (
                                    <td key={c.id} className="p-4 text-center">
                                        {c.available ? (
                                            <span className="inline-flex items-center gap-1 text-green-700 font-medium px-2 py-1 bg-green-50 rounded-full text-xs">
                                                <FaCheckCircle /> Available
                                            </span>
                                        ) : (
                                            <span className="text-red-500 font-medium text-xs">Unavailable</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="sticky left-0 bg-white p-4"></td>
                                {cars.map(c => (
                                    <td key={c.id} className="p-4">
                                        <Link 
                                            href={`/booking?carId=${c.id}`}
                                            className={`block w-full text-center py-2.5 rounded-lg font-bold transition-all ${
                                                c.available 
                                                ? 'bg-gray-900 text-white hover:bg-green-600 shadow-md' 
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            {c.available ? 'Book Now' : 'Out of Stock'}
                                        </Link>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </aside>
    );
}