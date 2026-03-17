"use client";
import React, { useEffect, useState } from "react";

// Inline SVG components for the Analytics UI
const IconTrendingUp = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);
const IconMessageSquare = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);
const IconCheckCircle = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);
const IconUsers = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const IconZap = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);

export default function ChatbotStatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const brand = {
    primary: 'bg-emerald-700',
    accent: 'text-emerald-700',
    bgLight: 'bg-emerald-50',
    border: 'border-emerald-100',
    gradient: 'from-emerald-700 to-emerald-900',
  };

  useEffect(() => {
    setLoading(true);
    fetch("https://api.citydrivehire.com/admin/chatbot_stats.php?action=summary")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load statistics");
        setLoading(false);
      });
  }, []);

  const StatCard = ({ title, value, icon: Icon, colorClass, subtitle }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon />
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">30 Day Window</span>
      </div>
      <div>
        <div className="text-3xl font-black text-gray-900 leading-none mb-1">{value}</div>
        <div className="text-sm font-bold text-gray-500">{title}</div>
        {subtitle && <p className="text-[10px] text-gray-400 mt-2">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-8xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Internal Data</span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Intelligence Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">Performance metrics and interaction analysis for the CityDrive AI Assistant.</p>
          </div>
          <div className="text-right">
             <button 
                onClick={() => window.location.reload()} 
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors underline decoration-emerald-200 underline-offset-4"
              >
                Sync Latest Records
              </button>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl flex items-center gap-3">
             <IconZap />
             <span className="font-bold text-sm">{error}</span>
          </div>
        )}

        {stats && !loading && (
          <div className="space-y-8 animate-in fade-in duration-700">
            {/* Top Grid: Key Performance Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Traffic" 
                value={stats.total} 
                icon={IconTrendingUp} 
                colorClass="bg-blue-50 text-blue-600"
                subtitle="Total messages processed"
              />
              <StatCard 
                title="Success Rate" 
                value={stats.matched} 
                icon={IconCheckCircle} 
                colorClass="bg-emerald-50 text-emerald-600"
                subtitle="Questions answered by AI"
              />
              <StatCard 
                title="Unmatched" 
                value={stats.unmatched} 
                icon={IconZap} 
                colorClass="bg-orange-50 text-orange-600"
                subtitle="Requiring human intervention"
              />
              <StatCard 
                title="Unique Users" 
                value={stats.unique_users} 
                icon={IconUsers} 
                colorClass="bg-purple-50 text-purple-600"
                subtitle="Individual customer sessions"
              />
            </div>

            {/* Middle Section: Top Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Questions */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                  <IconMessageSquare />
                  <h2 className="font-extrabold text-gray-800">Frequent Inquiries</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {stats.top_questions.map((q, i) => (
                      <div key={i} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4 flex-1">
                          <span className="text-xs font-black text-gray-300 w-4">{i + 1}</span>
                          <div className="bg-gray-50 rounded-xl px-4 py-2 text-sm text-gray-700 font-medium flex-1 border border-transparent group-hover:border-emerald-100 transition-all">
                            {q.question}
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <span className="text-sm font-black text-emerald-700">{q.count}</span>
                          <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Hits</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Keywords */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                  <IconZap />
                  <h2 className="font-extrabold text-gray-800">Dominant Keywords</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {stats.top_keywords.map((k, i) => (
                      <div key={i} className="flex items-center justify-between group">
                         <div className="flex items-center gap-4 flex-1">
                           <span className="text-xs font-black text-gray-300 w-4">{i + 1}</span>
                           <div className="flex items-center gap-2">
                             <span className="bg-emerald-700 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                               {k.matched_keyword || 'DEFAULT'}
                             </span>
                           </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                               <div 
                                 className="h-full bg-emerald-500 rounded-full" 
                                 style={{ width: `${(k.count / stats.total) * 100}%` }}
                               ></div>
                            </div>
                            <div className="text-right w-12">
                              <span className="text-sm font-black text-gray-800">{k.count}</span>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-[10px] text-emerald-700 font-bold leading-tight uppercase tracking-wider">
                      Strategy Insight:
                    </p>
                    <p className="text-xs text-emerald-900 mt-1">
                      {stats.top_keywords[0]?.matched_keyword || 'The bot'} is currently your most active trigger. Ensure its response is fully optimized.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">CityDrive Data Systems • Confidential Admin Access</p>
        </footer>
      </div>
    </div>
  );
}