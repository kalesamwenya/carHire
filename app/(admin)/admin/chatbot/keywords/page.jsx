"use client";
import React, { useEffect, useState } from "react";

// Inline SVG components for the Admin UI
const IconPlus = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const IconTrash = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);
const IconKey = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3y2.5z"></path></svg>
);
const IconTest = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-12.7 8.38 8.38 0 0 1 3.8.9L21 3.5Z"></path></svg>
);

export default function ChatbotKeywordsAdmin() {
  const [keywords, setKeywords] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Test/Preview State
  const [testInput, setTestInput] = useState("");
  const [testResult, setTestResult] = useState(null);

  const brand = {
    primary: 'bg-emerald-700',
    primaryHover: 'hover:bg-emerald-800',
    accent: 'text-emerald-700',
    border: 'border-emerald-100',
    bgLight: 'bg-emerald-50',
  };

  const fetchKeywords = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://api.citydrivehire.com/admin/chatbot_keywords.php?action=list");
      const data = await res.json();
      setKeywords(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load keywords database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeywords();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!keyword.trim() || !answer.trim()) {
      setError("Both keyword and answer are required.");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("action", "add");
      form.append("keyword", keyword);
      form.append("answer", answer);
      const res = await fetch("https://api.citydrivehire.com/admin/chatbot_keywords.php", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data.success) {
        setKeyword("");
        setAnswer("");
        setSuccess("Keyword added successfully!");
        fetchKeywords();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Failed to add entry.");
      }
    } catch {
      setError("Network error: Failed to add keyword.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this keyword? This action cannot be undone.")) return;
    
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("action", "delete");
      form.append("id", id);
      const res = await fetch("https://api.citydrivehire.com/admin/chatbot_keywords.php", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Keyword deleted.");
        fetchKeywords();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Delete operation failed.");
      }
    } catch {
      setError("Network error: Could not delete entry.");
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async (e) => {
    e.preventDefault();
    if (!testInput.trim()) return;
    
    setLoading(true);
    setTestResult(null);
    try {
      const res = await fetch("https://api.citydrivehire.com/chatbot.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: testInput })
      });
      const data = await res.json();
      setTestResult(data.reply);
    } catch {
      setTestResult("Error: Could not connect to the chatbot for testing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-8xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Chatbot Management</h1>
            <p className="mt-2 text-sm text-gray-600">Define automated responses for your CityDrive customer support bot.</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live System</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Action Card: Add New Keyword */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className={`${brand.primary} px-6 py-4 text-white flex items-center gap-2`}>
              <IconPlus />
              <span className="font-semibold">Add New Training Data</span>
            </div>
            <form onSubmit={handleAdd} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Trigger Keyword</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <IconKey />
                    </div>
                    <input
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-700 transition-all outline-none"
                      placeholder="e.g. 'refund', 'booking', 'price'"
                      value={keyword}
                      onChange={e => setKeyword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Automated Answer</label>
                  <textarea
                    rows="1"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-700 transition-all outline-none resize-none"
                    placeholder="The message the bot will send..."
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  {error && <div className="text-red-600 text-xs font-medium bg-red-50 p-2 rounded-lg inline-block">{error}</div>}
                  {success && <div className="text-emerald-600 text-xs font-medium bg-emerald-50 p-2 rounded-lg inline-block">{success}</div>}
                </div>
                <button 
                  type="submit" 
                  className={`${brand.primary} ${brand.primaryHover} text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2`}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Save Rule'}
                </button>
              </div>
            </form>
          </div>

          {/* Test Sandbox Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-800">
                <IconTest />
                <h2 className="font-bold">Chatbot Sandbox</h2>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Preview Mode</span>
            </div>
            <div className="p-6">
              <form onSubmit={handleTest} className="flex gap-2 mb-4">
                <input
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-700 transition-all outline-none"
                  placeholder="Type a query to test your keyword triggers..."
                  value={testInput}
                  onChange={e => setTestInput(e.target.value)}
                  disabled={loading}
                />
                <button 
                  type="submit" 
                  className="bg-gray-800 hover:bg-black text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                  disabled={loading}
                >
                  Test
                </button>
              </form>
              
              {testResult && (
                <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl animate-in fade-in slide-in-from-top-2">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-1">Bot Response:</div>
                  <p className="text-sm text-gray-700 leading-relaxed">{testResult}</p>
                </div>
              )}
            </div>
          </div>

          {/* Data Table Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
              <h2 className="font-bold text-gray-800">Knowledge Base</h2>
              <span className="text-[10px] font-bold bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{keywords.length} Entries</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white">
                    <th className="px-6 py-4">Trigger Keyword</th>
                    <th className="px-6 py-4">Response Content</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading && keywords.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center text-gray-400 italic">Loading database...</td>
                    </tr>
                  ) : keywords.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center text-gray-400 italic">No keywords configured yet.</td>
                    </tr>
                  ) : (
                    keywords.map((k) => (
                      <tr key={k.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${brand.bgLight} ${brand.accent}`}>
                            {k.keyword}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600 max-w-md line-clamp-2 leading-relaxed">{k.answer}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            className="p-2 text-gray-300 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                            onClick={() => handleDelete(k.id)}
                            disabled={loading}
                            title="Delete Rule"
                          >
                            <IconTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <footer className="mt-8 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">CityDrive Admin Panel v2.0</p>
        </footer>
      </div>
    </div>
  );
}