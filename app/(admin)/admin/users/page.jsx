'use client';

import Link from 'next/link'; // <--- 1. Import Link
import { FaUser, FaBriefcase, FaEllipsisV, FaEye } from 'react-icons/fa';

const users = [
    { id: 'USR-101', name: 'Alice Walker', email: 'alice@test.com', role: 'customer', joined: '2025-01-10' },
    { id: 'USR-102', name: 'Bob Builder', email: 'bob@const.com', role: 'partner', joined: '2025-03-15' },
    { id: 'USR-103', name: 'Charlie Day', email: 'charlie@test.com', role: 'customer', joined: '2025-06-20' },
];

export default function UsersPage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">Filter</button>
                    <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">Export CSV</button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                    <tr>
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">Role</th>
                        <th className="px-6 py-3">Joined Date</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 group">
                            <td className="px-6 py-4">
                                {/* --- 2. LINK THE USER DETAILS --- */}
                                <Link href={`/admin/users/${user.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm ${user.role === 'partner' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">{user.name}</p>
                                        <p className="text-xs text-gray-400">{user.email}</p>
                                    </div>
                                </Link>
                            </td>
                            <td className="px-6 py-4">
                                {user.role === 'partner' ? (
                                    <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full text-xs font-bold border border-purple-100">
                        <FaBriefcase className="text-[10px]" /> Partner
                      </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold border border-blue-100">
                        <FaUser className="text-[10px]" /> Customer
                      </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-gray-500 font-medium">{user.joined}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end items-center gap-2">
                                    {/* View Button Link */}
                                    <Link
                                        href={`/admin/users/${user.id}`}
                                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="View Profile"
                                    >
                                        <FaEye />
                                    </Link>
                                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                                        <FaEllipsisV />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}