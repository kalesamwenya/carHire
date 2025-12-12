'use client';

import { FaLifeRing, FaSearch, FaFilter, FaCheck, FaReply, FaExclamationCircle } from 'react-icons/fa';

const tickets = [
    { id: 'TKT-2029', user: 'Alice Walker', subject: 'Car broke down on highway', priority: 'High', status: 'Open', date: '2 hours ago' },
    { id: 'TKT-2028', user: 'Bob Builder', subject: 'Question about insurance', priority: 'Medium', status: 'In Progress', date: '5 hours ago' },
    { id: 'TKT-2025', user: 'Charlie Day', subject: 'Refund request for trip #BK-400', priority: 'Low', status: 'Closed', date: '1 day ago' },
];

export default function HelpDeskPage() {
    return (
        <div className="space-y-6">

            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Help Desk</h1>
                    <p className="text-sm text-gray-500">Manage support tickets and inquiries.</p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-bold border border-red-100 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span> 3 Urgent
                    </div>
                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold border border-blue-100">
                        12 Open
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input type="text" placeholder="Search tickets..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 w-64" />
                </div>
                <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 text-sm font-medium">
                    <FaFilter /> Filter Status
                </button>
            </div>

            {/* Ticket List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                    <tr>
                        <th className="px-6 py-3">Ticket ID</th>
                        <th className="px-6 py-3">Subject</th>
                        <th className="px-6 py-3">Customer</th>
                        <th className="px-6 py-3">Priority</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {tickets.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-gray-50 group transition-colors">
                            <td className="px-6 py-4 font-mono text-xs font-bold text-gray-500">#{ticket.id}</td>
                            <td className="px-6 py-4">
                                <p className="font-medium text-gray-900">{ticket.subject}</p>
                                <p className="text-xs text-gray-400">{ticket.date}</p>
                            </td>
                            <td className="px-6 py-4">{ticket.user}</td>
                            <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      ticket.priority === 'High' ? 'bg-red-100 text-red-700' :
                          ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                  }`}>
                    {ticket.priority === 'High' && <FaExclamationCircle />}
                      {ticket.priority}
                  </span>
                            </td>
                            <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                        ticket.status === 'Open' ? 'text-blue-600 bg-blue-50' :
                            ticket.status === 'Closed' ? 'text-gray-500 bg-gray-100' :
                                'text-orange-600 bg-orange-50'
                    }`}>
                        {ticket.status}
                    </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Reply">
                                        <FaReply />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Resolve">
                                        <FaCheck />
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