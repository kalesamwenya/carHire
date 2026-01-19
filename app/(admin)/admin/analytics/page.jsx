'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaArrowUp, FaChartLine, FaDesktop, FaMobileAlt, 
  FaMapMarkerAlt, FaCarSide, FaHistory, 
  FaMoneyBillWave 
} from 'react-icons/fa';

export default function AnalyticsPage() {
    const [data, setData] = useState(null);
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);
    
    const [showFleet, setShowFleet] = useState(false);
    const [showRevenue, setShowRevenue] = useState(false);

      const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    useEffect(() => {
        // Inside your AnalyticsPage useEffect:
const fetchAnalytics = async () => {
    setLoading(true);
    try {
        const res = await axios.get(`${BASE_API}/reports/get_business_analytics.php?year=${year}`);
        
        // Robust JSON check
        let responseData = res.data;
        if (typeof responseData === 'string') {
            try {
                responseData = JSON.parse(responseData);
            } catch (e) {
                console.error("Malformed JSON received", responseData);
                setData({ success: false, message: "Invalid API Response Format" });
                return;
            }
        }
        
        setData(responseData);
    } catch (err) {
        console.error("Network Error", err);
        setData({ success: false, message: "Cannot reach server" });
    } finally {
        setLoading(false);
    }
};
        fetchAnalytics();
    }, [year]);

    if (loading) return <div className="p-20 text-center animate-pulse text-gray-400 font-bold">Synchronizing Database...</div>;
    
    // Safety check: ensure 'success' is true and 'chart' exists
    if (!data || data.success === false) {
        return <div className="p-20 text-center text-red-500 font-bold">Database Connection Failed: Check API Output</div>;
    }

    // Default Fallbacks for data to prevent .map crashes
    const chartData = data.chart || [];
    const fleetData = (data.fleet || []).filter(car => car.lat !== null && car.lng !== null);
    const revenuePoints = (data.revenuePoints || []).filter(p => p.lat !== null);
    const trafficPoints = (data.allPoints || []).filter(p => p.lat !== null);
    const recentActivity = data.recentActivity || [];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Business Analytics</h1>
                    <p className="text-sm text-gray-500">Live traffic and fleet telemetry for Zambia.</p>
                </div>
                <select 
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm shadow-sm outline-none cursor-pointer hover:bg-gray-50"
                >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                </select>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl text-blue-500 group-hover:scale-110 transition-transform"><FaChartLine /></div>
                    <p className="text-gray-500 text-xs font-bold uppercase">Net Profit (After Maintenance)</p>
                    <h3 className="text-3xl font-extrabold text-gray-900 mt-1">K{(data.netProfit || 0).toLocaleString()}</h3>
                    <span className="text-green-600 text-xs font-bold flex items-center mt-2"><FaArrowUp className="mr-1"/> 15% vs {year - 1}</span>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-xs font-bold uppercase">Live Conversion Rate</p>
                    <h3 className="text-3xl font-extrabold text-gray-900 mt-1">{data.conversionRate || 0}%</h3>
                    <span className="text-slate-400 text-xs font-bold flex items-center mt-2">Bookings per unique visitor</span>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-xs font-bold uppercase">Avg. Booking Value</p>
                    <h3 className="text-3xl font-extrabold text-gray-900 mt-1">K{(data.abv || 0).toLocaleString()}</h3>
                    <span className="text-green-600 text-xs font-bold flex items-center mt-2"><FaArrowUp className="mr-1"/> K120 vs last month</span>
                </div>
            </div>

            {/* CHART SECTION */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-6">Income vs Maintenance ({year})</h3>
                <div className="relative h-64 flex items-end justify-between gap-4 sm:gap-8 px-2">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                        {[...Array(5)].map((_, i) => <div key={i} className="w-full border-t border-gray-50"></div>)}
                    </div>
                    {chartData.map((item, idx) => (
                        <div key={idx} className="flex-1 flex gap-1 justify-center h-full items-end z-10 group cursor-pointer">
                            <div style={{ height: `${Math.min(item.in || 0, 100)}%` }} className="w-3 sm:w-6 bg-blue-600 rounded-t-sm opacity-80 group-hover:opacity-100 transition-all relative">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 z-20">K{item.in}k</div>
                            </div>
                            <div style={{ height: `${Math.min(item.ex || 0, 100)}%` }} className="w-3 sm:w-6 bg-red-400 rounded-t-sm opacity-80 group-hover:opacity-100 transition-all"></div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between px-2 mt-4 text-[10px] font-bold text-gray-400 uppercase">
                    {chartData.map((d, i) => <span key={i}>{d.m}</span>)}
                </div>
            </div>

            {/* ZAMBIA HEATMAP & SOURCES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-red-500"/> {showRevenue ? 'Revenue Map' : 'Visitor Density'}: Zambia
                        </h3>
                        
                        <div className="flex gap-2">
                            <button 
                                onClick={() => { setShowRevenue(!showRevenue); if(!showRevenue) setShowFleet(false); }}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all flex items-center gap-2 ${showRevenue ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-400'}`}
                            >
                                <FaMoneyBillWave /> REVENUE
                            </button>

                            <button 
                                onClick={() => { setShowFleet(!showFleet); if(!showFleet) setShowRevenue(false); }}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all flex items-center gap-2 ${showFleet ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400'}`}
                            >
                                <FaCarSide /> FLEET
                            </button>
                        </div>
                    </div>
                    
                    <div className="h-64 bg-slate-50 rounded-lg border border-gray-100 relative overflow-hidden">
                        {/* Traffic */}
                        {!showRevenue && !showFleet && trafficPoints.map((point, i) => (
                            <div 
                                key={`v-${i}`}
                                className="absolute w-3 h-3 bg-blue-500 rounded-full blur-[2px] opacity-40 animate-pulse"
                                style={{ left: `${((point.lng - 22) / 12) * 100}%`, top: `${((point.lat + 18) / 10) * 100}%` }}
                            />
                        ))}

                        {/* Revenue Points */}
                        {showRevenue && revenuePoints.map((point, i) => (
                            <div 
                                key={`r-${i}`}
                                className="absolute w-4 h-4 bg-amber-400 rounded-full blur-[1px] opacity-80 animate-ping"
                                style={{ left: `${((point.lng - 22) / 12) * 100}%`, top: `${((point.lat + 18) / 10) * 100}%` }}
                            />
                        ))}
                        
                        {/* Fleet Layer */}
                        {showFleet && fleetData.map((car, i) => (
                            <div 
                                key={`c-${i}`}
                                className="absolute z-20 group cursor-pointer"
                                style={{ left: `${((car.lng - 22) / 12) * 100}%`, top: `${((car.lat + 18) / 10) * 100}%` }}
                            >
                                <FaCarSide className="text-red-600 drop-shadow-md transition-transform hover:scale-125" />
                                <div className="absolute hidden group-hover:block bg-gray-900 text-white text-[8px] p-1 rounded -top-6 left-0 whitespace-nowrap z-50">{car.type || car.car_model}</div>
                            </div>
                        ))}

                        <div className="absolute bottom-2 right-2 text-[9px] text-gray-400 uppercase font-bold bg-white/80 px-2 py-1 rounded">
                            Telemetric View: {showRevenue ? 'Revenue' : showFleet ? 'Fleet' : 'Active Sessions'}
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-2"><FaHistory /> Live Activity</h4>
                        <div className="space-y-2">
                            {recentActivity.slice(0, 3).map((act, i) => (
                                <div key={i} className="flex justify-between text-[11px] bg-gray-50 p-2 rounded border border-gray-100">
                                    <span className="text-gray-600 font-bold">{act.os || 'Web'} • {act.platform || 'Direct'}</span>
                                    <span className="text-blue-500">{act.visit_date ? new Date(act.visit_date).toLocaleTimeString() : '--:--'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* AI INSIGHTS */}
                <div className="flex flex-col gap-6">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-xl shadow-lg text-white relative flex-1">
                        <div className="absolute top-0 right-0 p-6 opacity-20 text-8xl"><FaMapMarkerAlt /></div>
                        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">AI Business Insights</h3>
                        
                        <p className="text-slate-300 text-sm mb-8 leading-relaxed">
                            Currently, <span className="text-blue-400 font-bold">{data.topLocation?.name || 'Lusaka'}</span> is your highest performing hub. 
                            Demand is trending upward in this region for {year}.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white/10 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Top OS</p>
                                <p className="text-lg font-bold">{data.osStats?.[0]?.os || 'Windows'}</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Region Hub</p>
                                <p className="text-lg font-bold">{data.topLocation?.name || 'Lusaka'}</p>
                            </div>
                        </div>

                        <div className="bg-blue-500/20 border border-blue-400/30 p-4 rounded-xl">
                            <h4 className="text-xs font-bold text-blue-300 uppercase mb-1">Market Strategy</h4>
                            <p className="text-xs text-blue-100/80 leading-relaxed">
                                {(data.sources?.mobile || 0) > 50 
                                    ? "Mobile access is peaking. We suggest optimizing Lusaka-based mobile bookings." 
                                    : "Desktop conversion is stable. Maintain Copperbelt corporate outreach."}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4 text-xs uppercase text-gray-400">Device Distribution</h3>
                        <div className="space-y-4">
                             <SourceItem icon={<FaMobileAlt />} label="Mobile" val={data.sources?.mobile || 0} color="bg-purple-500" />
                             <SourceItem icon={<FaDesktop />} label="Desktop" val={data.sources?.desktop || 0} color="bg-blue-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SourceItem({ icon, label, val, color }) {
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="flex items-center gap-2 text-gray-500">{icon} {label}</span>
                <span className="font-bold text-gray-800">{val}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${val}%` }}></div>
            </div>
        </div>
    );
}