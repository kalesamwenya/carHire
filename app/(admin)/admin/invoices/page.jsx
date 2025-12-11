'use client';

import { FaDownload, FaFileInvoice } from 'react-icons/fa';

const invoices = [
    { id: 'INV-001', user: 'John Doe', date: 'Oct 24, 2025', amount: 360, status: 'Paid' },
    { id: 'INV-002', user: 'Jane Smith', date: 'Oct 26, 2025', amount: 120, status: 'Unpaid' },
    { id: 'INV-003', user: 'Company X', date: 'Nov 02, 2025', amount: 1500, status: 'Paid' },
];

export default function InvoicesPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Invoices</h1>

            <div className="grid gap-4">
                {invoices.map((inv) => (
                    <div key={inv.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                <FaFileInvoice />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{inv.id}</p>
                                <p className="text-xs text-gray-500">Billed to {inv.user} on {inv.date}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                            <div className="text-right">
                                <p className="font-bold text-lg text-gray-900">${inv.amount}</p>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {inv.status}
                        </span>
                            </div>
                            <button className="text-gray-400 hover:text-green-600 transition-colors p-2 border border-gray-200 rounded-lg hover:border-green-600">
                                <FaDownload />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}