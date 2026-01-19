'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaIdCard, FaUpload, FaCheckCircle } from 'react-icons/fa';

export default function KYCUpload() {
    const { data: session } = useSession();
    const [files, setFiles] = useState({ front: null, back: null });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

     const Public_Api = "https://api.citydrivehire.com";

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!files.front || !files.back) return alert("Please upload both sides of your ID.");

        setLoading(true);
        const formData = new FormData();
        formData.append('id_front', files.front);
        formData.append('id_back', files.back);
        formData.append('user_id', session.user.id);

        try {
            const res = await fetch(`${Public_Api}/partners/upload-kyc.php`, {
                method: 'POST',
                body: formData, // No headers needed, browser sets multipart/form-data
            });
            const data = await res.json();
            if (data.status === 'success') setStatus('success');
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'success') {
        return (
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-sm text-center">
                <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
                <h2 className="text-xl font-bold">Documents Submitted!</h2>
                <p className="text-gray-500">City Drive Hire team will verify your ID within 24 hours.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm">
            <h1 className="text-2xl font-bold mb-2">Partner Verification</h1>
            <p className="text-gray-500 mb-8">Please upload a clear copy of your National ID (NRC) or Passport.</p>

            <form onSubmit={handleUpload} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Front Side */}
                    <div className="border-2 border-dashed border-gray-200 p-4 rounded-lg text-center">
                        <p className="text-sm font-semibold mb-2">Front Side</p>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => setFiles({...files, front: e.target.files[0]})}
                            className="hidden" id="front-id" 
                        />
                        <label htmlFor="front-id" className="cursor-pointer flex flex-col items-center">
                            <FaIdCard className="text-3xl text-gray-400 mb-2" />
                            <span className="text-xs text-blue-600 underline">Select Image</span>
                        </label>
                        {files.front && <p className="text-[10px] mt-2 text-green-600 truncate">{files.front.name}</p>}
                    </div>

                    {/* Back Side */}
                    <div className="border-2 border-dashed border-gray-200 p-4 rounded-lg text-center">
                        <p className="text-sm font-semibold mb-2">Back Side</p>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => setFiles({...files, back: e.target.files[0]})}
                            className="hidden" id="back-id" 
                        />
                        <label htmlFor="back-id" className="cursor-pointer flex flex-col items-center">
                            <FaIdCard className="text-3xl text-gray-400 mb-2" />
                            <span className="text-xs text-blue-600 underline">Select Image</span>
                        </label>
                        {files.back && <p className="text-[10px] mt-2 text-green-600 truncate">{files.back.name}</p>}
                    </div>
                </div>

                <button 
                    disabled={loading}
                    className="w-full bg-green-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-800 transition-colors"
                >
                    {loading ? 'Uploading...' : <><FaUpload /> Submit for Verification</>}
                </button>
            </form>
        </div>
    );
}