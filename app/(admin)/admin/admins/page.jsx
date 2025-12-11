'use client';

import Link from 'next/link';
import { FaUserShield, FaPlus, FaEdit, FaTrash, FaLock } from 'react-icons/fa';

const admins = [
    { id: 1, name: 'Kaleb (You)', email: 'kaleb@emit.com', role: 'Super Admin', status: 'Active', lastLogin: 'Just now' },
    { id: 2, name: 'Sarah Connor', email: 'sarah@emit.com', role: 'Fleet Manager', status: 'Active', lastLogin: '2 hours ago' },
    { id: 3, name: 'John Smith', email: 'john@emit.com', role: 'Support Agent', status: 'Inactive', lastLogin: '3 days ago' },
];

export default function AdminListPage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Team Management</h1>
                    <p className="text-sm text-gray-500">Manage staff access and permissions.</p>
                </div>
                <Link href="/admin/admins/new" className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors shadow-sm">
                    <FaPlus /> Add New Admin
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                    <tr>
                        <th className="px-6 py-3">Admin User</th>
                        <th className="px-6 py-3">Access Level</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Last Login</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {admins.map((admin) => (
                        <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                                        <FaUserShield />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{admin.name}</p>
                                        <p className="text-xs text-gray-400">{admin.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      admin.role === 'Super Admin' ? 'bg-purple-100 text-purple-800' :
                          admin.role === 'Fleet Manager' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                  }`}>
                    {admin.role === 'Super Admin' && <FaLock className="mr-1 text-[10px]" />}
                      {admin.role}
                  </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`w-2 h-2 rounded-full inline-block mr-2 ${admin.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                {admin.status}
                            </td>
                            <td className="px-6 py-4 text-gray-400">{admin.lastLogin}</td>
                            <td className="px-6 py-4 text-right flex justify-end gap-3">
                                <button className="text-blue-600 hover:text-blue-800 p-1"><FaEdit /></button>
                                {admin.role !== 'Super Admin' && (
                                    <button className="text-red-600 hover:text-red-800 p-1"><FaTrash /></button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}