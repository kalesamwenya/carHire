'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaUser, FaBriefcase, FaEllipsisV, FaEye, FaSpinner, FaBuilding } from 'react-icons/fa';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

      const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    useEffect(() => {
    async function fetchUsers() {
        try {
            const res = await fetch(`${BASE_API}/admin/user-list.php`);
            if (res.ok) {
                const jsonResponse = await res.json();
                
                // --- THE FIX: Access jsonResponse.data ---
                // We check if success is true and if data is actually an array
                if (jsonResponse.success && Array.isArray(jsonResponse.data)) {
                    setUsers(jsonResponse.data);
                } else {
                    setUsers([]); // Fallback to empty array to prevent .map error
                }
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setUsers([]); // Fallback on network error
        } finally {
            setLoading(false);
        }
    }
    fetchUsers();
}, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <FaSpinner className="animate-spin text-green-600 text-3xl mb-4" />
                <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Syncing Emit Database...</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">User & Partner Directory</h1>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm">Export Data</button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500">
                        <tr>
                            <th className="px-6 py-4">Identity</th>
                            <th className="px-6 py-4">Affiliation / Role</th>
                            <th className="px-6 py-4">Registration</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${user.role === 'partner' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                                            {user.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-400">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {user.role === 'partner' ? (
                                        <div className="flex flex-col gap-1">
                                            <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-[10px] font-black uppercase border border-purple-100 w-fit">
                                                Partner
                                            </span>
                                            <p className="text-xs font-bold text-gray-600 flex items-center gap-1">
                                                <FaBuilding className="text-gray-400" /> {user.company_name || 'Individual Partner'}
                                            </p>
                                        </div>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-black uppercase border border-blue-100 w-fit">
                                            Customer
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-gray-500 font-medium">
                                    {new Date(user.joined).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/admin/users/${user.id}`} className="inline-block p-2 text-gray-400 hover:text-green-600 transition-colors">
                                        <FaEye size={18} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}