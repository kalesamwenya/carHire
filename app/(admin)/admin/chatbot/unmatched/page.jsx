"use client";
import React, { useEffect, useState } from "react";

// Inline SVG components for the Admin UI
const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);
const IconAlert = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
);
const IconGlobe = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
);
const IconDevice = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
);

export default function ChatbotUnmatchedAdmin() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const brand = {
    primary: 'bg-emerald-700',
    accent: 'text-emerald-700',
    bgLight: 'bg-emerald-50',
    border: 'border-emerald-100',
  };

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://api.citydrivehire.com/admin/chatbot_unmatched.php?action=list");
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to synchronize unmatched query logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-8xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Unmatched Queries</h1>
            <p className="mt-2 text-sm text-gray-600">Review questions that the chatbot couldn't answer to improve your knowledge base.</p>
          </div>
          <button 
            onClick={fetchLogs}
            className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all font-semibold text-sm text-gray-700"
          >
            Refresh Logs
          </button>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Misses</div>
            <div className="text-3xl font-black text-gray-900">{logs.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Status</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span className="text-sm font-bold text-emerald-700">System Healthy</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Action Required</div>
            <div className="text-sm font-medium text-gray-600 mt-1">Add keywords for recurring topics</div>
          </div>
        </div>

        {/* Logs Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {error && (
            <div className="m-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 text-sm font-medium">
              <IconAlert /> {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Unmatched Question</th>
                  <th className="px-6 py-4">Connection Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-gray-400 italic">Synchronizing logs...</td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-gray-400 italic">No unmatched questions logged. Everything is covered!</td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-500 font-medium text-xs">
                          <IconClock />
                          {log.created_at}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="bg-emerald-50 text-emerald-900 px-4 py-3 rounded-xl border border-emerald-100 inline-block max-w-lg">
                          <p className="text-sm font-bold leading-snug">"{log.question}"</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                            <IconGlobe />
                            <span>IP: {log.user_ip}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 max-w-[200px]">
                            <IconDevice />
                            <span className="truncate" title={log.user_agent}>UA: {log.user_agent}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <footer className="mt-8 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">CityDrive Intelligence v2.0</p>
        </footer>
      </div>
    </div>
  );
}