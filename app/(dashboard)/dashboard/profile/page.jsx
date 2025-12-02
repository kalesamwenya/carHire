import { FaUser, FaEnvelope, FaIdCard, FaPhone } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

async function getUser() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/users?me=true`, { cache: 'no-store' });
    return res.ok ? res.json() : null;
}

export default async function ProfilePage() {
    const user = await getUser();

    if (!user) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-8 border-b border-gray-200 flex flex-col items-center">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl font-bold mb-4">
                        {user.name?.[0]}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                    <p className="text-gray-500">{user.role || 'Member'}</p>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                                <FaUser className="text-gray-400" />
                                {user.name}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                                <FaEnvelope className="text-gray-400" />
                                {user.email}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Driver's License</label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900">
                                <FaIdCard className="text-gray-400" />
                                {user.driver_license || 'Not provided'}
                            </div>
                        </div>
                    </div>

                    <button className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors">
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
}