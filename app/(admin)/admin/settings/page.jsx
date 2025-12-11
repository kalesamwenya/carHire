'use client';

export default function SettingsPage() {
    return (
        <div className="max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">System Settings</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">

                {/* General Info */}
                <section>
                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">General Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Site Name</label>
                            <input type="text" defaultValue="Emit Car Hire" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Support Email</label>
                            <input type="email" defaultValue="admin@emit.com" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Currency Symbol</label>
                            <select className="w-full border border-gray-300 rounded-lg p-2.5 text-sm">
                                <option value="USD">USD ($)</option>
                                <option value="ZMW">ZMW (K)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Security */}
                <section>
                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Security</h2>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                            <p className="font-bold text-gray-900">Admin Password</p>
                            <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                        </div>
                        <button className="text-green-600 font-bold text-sm hover:underline">Change Password</button>
                    </div>
                </section>

                <div className="pt-4 flex justify-end">
                    <button className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-green-700 shadow-md">
                        Save Changes
                    </button>
                </div>

            </div>
        </div>
    );
}