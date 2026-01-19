'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FaUserShield, FaPlus, FaEdit, FaTrash, FaLock, FaSearch, FaFilter, FaSortAmountDown } from 'react-icons/fa';

export default function AdminListPage() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [sortBy, setSortBy] = useState("name");

    // Fetch Users from DB
    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const res = await axios.get('https://api.citydrivehire.com/admin/list.php');
                setAdmins(res.data);
            } catch (err) {
                console.error("Failed to fetch admins", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAdmins();
    }, []);

    // Logic: Filter and Search
    const filteredAdmins = useMemo(() => {
        return admins
            .filter(admin => {
                const matchesSearch = admin.name.toLowerCase().includes(search.toLowerCase()) || 
                                    admin.email.toLowerCase().includes(search.toLowerCase());
                const matchesRole = roleFilter === "All" || admin.role === roleFilter;
                return matchesSearch && matchesRole;
            })
            .sort((a, b) => {
                if (sortBy === "name") return a.name.localeCompare(b.name);
                return 0;
            });
    }, [admins, search, roleFilter, sortBy]);

    return (
        <div>
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Team Management</h1>
                    <p className="text-sm text-gray-500">Manage staff access and permissions.</p>
                </div>
                <Link href="/admin/admins/new" className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-sm active:scale-95">
                    <FaPlus /> Add New Admin
                </Link>
            </div>

            {/* Toolbar: Search, Filter, Sort */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input 
                        type="text" 
                        placeholder="Search name or email..." 
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="bg-white border border-gray-200 rounded-lg flex items-center px-3 w-full">
                        <FaFilter className="text-gray-400 text-xs mr-2" />
                        <select 
                            className="w-full py-2 bg-transparent text-sm outline-none cursor-pointer"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="All">All Roles</option>
                            <option value="Customer">Customer</option>
                            <option value="Partner">Partner</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="bg-white border border-gray-200 rounded-lg flex items-center px-3 w-full">
                        <FaSortAmountDown className="text-gray-400 text-xs mr-2" />
                        <select 
                            className="w-full py-2 bg-transparent text-sm outline-none cursor-pointer"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="name">Sort by Name</option>
                            <option value="newest">Newest First</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Admin User</th>
                            <th className="px-6 py-4">Access Level</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Last Login</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">Loading team members...</td></tr>
                        ) : filteredAdmins.length > 0 ? (
                            filteredAdmins.map((admin) => (
                                <tr key={admin.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                                                <FaUserShield />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{admin.name}</p>
                                                <p className="text-xs text-gray-400">{admin.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                            admin.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                            admin.role === 'Partner' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {admin.role === 'Admin' && <FaLock className="mr-1 text-[9px]" />}
                                            {admin.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <span className={`w-2 h-2 rounded-full inline-block mr-2 ${admin.status === 'Active' ? 'bg-green-500' : 'bg-orange-400 animate-pulse'}`}></span>
                                            <span className="text-xs font-medium text-gray-700">{admin.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-xs">{admin.lastLogin}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors" title="Edit"><FaEdit /></button>
                                            {admin.role !== 'Admin' && (
                                                <button className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Delete"><FaTrash /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">No users found matching your criteria.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}