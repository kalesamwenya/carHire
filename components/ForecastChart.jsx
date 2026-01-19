'use client';

import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, Line, ComposedChart, Legend
} from 'recharts';

export default function ForecastChart({ bookings = [] }) {
    
    const getLocalDateString = (date) => {
        const offset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
        return adjustedDate.toISOString().split('T')[0];
    };

    const chartData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const dateStr = getLocalDateString(d);
        
        // Calculate Last Week's same day
        const lastWeekD = new Date(d);
        lastWeekD.setDate(lastWeekD.getDate() - 7);
        const lastWeekDateStr = getLocalDateString(lastWeekD);

        // Current/Forecast Revenue
        const currentAmount = bookings
            .filter(b => b.start_date?.split(' ')[0] === dateStr)
            .reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);

        // Last Week's Revenue
        const lastWeekAmount = bookings
            .filter(b => b.start_date?.split(' ')[0] === lastWeekDateStr)
            .reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);
            
        return { 
            day: d.toLocaleDateString('en-US', { weekday: 'short' }), 
            current: currentAmount,
            previous: lastWeekAmount
        };
    });

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700">
                    <p className="text-[10px] uppercase font-black text-slate-500 mb-2 tracking-widest">
                        {payload[0].payload.day} Comparison
                    </p>
                    <div className="space-y-1">
                        <p className="text-sm font-bold flex items-center justify-between gap-4">
                            <span className="text-emerald-400 text-xs">Current:</span> 
                            <span>K{payload[0].value.toLocaleString()}</span>
                        </p>
                        <p className="text-sm font-bold flex items-center justify-between gap-4">
                            <span className="text-slate-400 text-xs">Last Week:</span> 
                            <span>K{payload[1].value.toLocaleString()}</span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    
                    <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                        dy={10}
                    />
                    
                    <YAxis hide={true} domain={[0, 'auto']} />
                    
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />
                    <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingBottom: '20px' }} />
                    
                    {/* Previous Week - Dashed Line */}
                    <Area 
                        name="Last Week"
                        type="monotone" 
                        dataKey="previous" 
                        stroke="#cbd5e1" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        fill="transparent"
                        animationDuration={2000}
                    />

                    {/* Current Week - Solid Area */}
                    <Area 
                        name="Current Week"
                        type="monotone" 
                        dataKey="current" 
                        stroke="#10b981" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorCurrent)" 
                        animationDuration={1000}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}