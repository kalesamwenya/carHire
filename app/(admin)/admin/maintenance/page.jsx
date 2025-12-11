'use client';

import { FaTools, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const maintenanceData = [
    { id: 1, car: 'Toyota Hilux (ABZ 1234)', type: 'Oil Change', date: '2025-10-12', cost: 150, status: 'Completed' },
    { id: 2, car: 'Mercedes C-Class (LUS 9988)', type: 'Brake Pads', date: '2025-12-01', cost: 400, status: 'Pending' },
    { id: 3, car: 'Suzuki Swift (KAB 5521)', type: 'Tire Rotation', date: '2025-11-20', cost: 80, status: 'Completed' },
];

export default function MaintenancePage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Maintenance Log</h1>
                <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 flex items-center gap-2">
                    <FaTools /> Schedule Service
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 uppercase font-semibold text-gray-500 text-xs">
                    <tr>
                        <th className="px-6 py-3">Vehicle</th>
                        <th className="px-6 py-3">Service Type</th>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Cost</th>
                        <th className="px-6 py-3">Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {maintenanceData.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{item.car}</td>
                            <td className="px-6 py-4">{item.type}</td>
                            <td className="px-6 py-4">{item.date}</td>
                            <td className="px-6 py-4 font-bold text-slate-700">${item.cost}</td>
                            <td className="px-6 py-4">
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold w-fit ${
                      item.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.status === 'Completed' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                      {item.status}
                  </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}