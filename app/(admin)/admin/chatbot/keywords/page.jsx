"use client";
import React, { useEffect, useState } from "react";

// --- Icons ---
const IconPlus = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const IconTrash = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);
const IconKey = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3"></path>
  </svg>
);
const IconTest = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-12.7 8.38 8.38 0 0 1 3.8.9L21 3.5Z"></path>
  </svg>
);

export default function ChatbotKeywordsAdmin() {
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Form State
  const [formData, setFormData] = useState({
    intent: "",
    keywords: "",
    answer: "",
    follow_up: "",
    priority: 1,
    action_links: ""
  });

  // Test Sandbox State
  const [testInput, setTestInput] = useState("");
  const [testResult, setTestResult] = useState(null);

  const brand = {
    primary: 'bg-brand-700',
    primaryHover: 'hover:bg-brand-800',
    accent: 'text-brand-700',
    border: 'border-brand-100',
    bgLight: 'bg-brand-50',
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

    if (!formData.keywords.trim() || !formData.answer.trim()) {
      setError("Keywords and answer are required.");
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("action", "add");
      Object.keys(formData).forEach(key => form.append(key, formData[key]));

      const res = await fetch("https://api.citydrivehire.com/admin/chatbot_keywords.php", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (data.success) {
        setFormData({ intent: "", keywords: "", answer: "", follow_up: "", priority: 1, action_links: "" });
        setSuccess("Training data saved successfully!");
        fetchKeywords();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Failed to save.");
      }
    } catch {
      setError("Network error: Failed to save entry.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this rule? This action cannot be undone.")) return;
    setLoading(true);
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
        setSuccess("Entry deleted.");
        fetchKeywords();
        setTimeout(() => setSuccess(""), 3000);
      }
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
      setTestResult("Error: Could not connect to chatbot.");
    } finally {
      setLoading(false);
    }
  };

  // Pagination Logic
  const start = (page - 1) * perPage;
  const paginated = keywords.slice(start, start + perPage);
  const totalPages = Math.ceil(keywords.length / perPage);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-8xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Chatbot Management</h1>
            <p className="mt-2 text-sm text-gray-600">Configure automated responses and training data.</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live System</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          
          {/* Add Entry Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className={`${brand.primary} px-6 py-4 text-white flex items-center gap-2`}>
              <IconPlus />
              <span className="font-semibold">Add New Training Rule</span>
            </div>
            <form onSubmit={handleAdd} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Intent Name</label>
                  <input
                    placeholder="e.g. greeting, pricing_info"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500 transition-all"
                    value={formData.intent}
                    onChange={(e) => setFormData({ ...formData, intent: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Keywords (Comma separated)</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><IconKey /></div>
                    <input
                      placeholder="refund, money back, return"
                      className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500 transition-all"
                      value={formData.keywords}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Bot Answer</label>
                  <textarea
                    placeholder="The message the bot sends..."
                    rows="2"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500 transition-all resize-none"
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Follow Up Question</label>
                  <input
                    placeholder="Did that help?"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500 transition-all"
                    value={formData.follow_up}
                    onChange={(e) => setFormData({ ...formData, follow_up: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Priority (1-10)</label>
                  <input
                    type="number"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500 transition-all"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Action Links (JSON format)</label>
                  <input
                    placeholder='[{"label": "Book Now", "url": "/book"}]'
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500 transition-all"
                    value={formData.action_links}
                    onChange={(e) => setFormData({ ...formData, action_links: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {error && <div className="text-red-600 text-xs font-medium bg-red-50 p-2 rounded-lg inline-block">{error}</div>}
                  {success && <div className="text-emerald-600 text-xs font-medium bg-emerald-50 p-2 rounded-lg inline-block">{success}</div>}
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`${brand.primary} ${brand.primaryHover} text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50`}
                >
                  {loading ? 'Processing...' : 'Save Rule'}
                </button>
              </div>
            </form>
          </div>

          {/* Sandbox Tester */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
              <IconTest />
              <h2 className="font-bold">Chatbot Sandbox</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleTest} className="flex gap-2 mb-4">
                <input
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  placeholder="Test a message here..."
                  value={testInput}
                  onChange={e => setTestInput(e.target.value)}
                />
                <button type="submit" className="bg-gray-800 hover:bg-black text-white px-6 py-3 rounded-xl font-bold transition-all">Test</button>
              </form>
              {testResult && (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl animate-in fade-in slide-in-from-top-2">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">Bot Response:</span>
                  <p className="text-sm text-gray-700">{testResult}</p>
                </div>
              )}
            </div>
          </div>

          {/* Knowledge Base Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
              <h2 className="font-bold">Knowledge Base</h2>
              <span className="text-[10px] font-bold bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{keywords.length} Entries</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <th className="px-6 py-4">Intent / Keywords</th>
                    <th className="px-6 py-4">Response Content</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((k) => (
                    <tr key={k.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 text-xs mb-1">{k.intent || 'No Intent'}</div>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${brand.bgLight} ${brand.accent}`}>
                          {k.keywords}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 max-w-md line-clamp-2">{k.answer}</p>
                        {k.follow_up && <p className="text-[10px] text-gray-400 mt-1 italic">Follow-up: {k.follow_up}</p>}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-500">{k.priority}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDelete(k.id)} className="p-2 text-gray-300 hover:text-red-600 transition-colors">
                          <IconTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 p-6 border-t border-gray-50">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${page === i + 1 ? "bg-black text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <footer className="mt-8 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Admin Panel v1.2 — Systems Live</p>
        </footer>
      </div>
    </div>
  );
}