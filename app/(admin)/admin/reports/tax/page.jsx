'use client';

import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

import {
    FaCalculator,
    FaSearch,
    FaCalendarAlt,
    FaCheckCircle,
    FaChartLine,
    FaArrowUp,
    FaWallet,
    FaShieldAlt,
    FaDatabase,
    FaFileExcel,
    FaChevronLeft,
    FaChevronRight,
} from 'react-icons/fa';

import CityDriveLoader from '@/components/CityDriveLoader';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportTransactionsToExcel = (
    transactions,
    monthName
) => {
    const worksheet =
        XLSX.utils.json_to_sheet(transactions);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Transactions'
    );

    const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
    });

    const data = new Blob([excelBuffer], {
        type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    saveAs(
        data,
        `Transactions_Report_${monthName}.xlsx`
    );
};

export default function TaxReports() {
    const [currentPage, setCurrentPage] =
        useState(1);

    const [reports, setReports] = useState([]);

    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] =
        useState('');

    const ITEMS_PER_PAGE = 10;

    const BASE_API =
        process.env.NEXT_PUBLIC_API_URL ||
        'https://api.citydrivehire.com';

    useEffect(() => {
        const fetchTaxData = async () => {
            try {
                setLoading(true);

                // TAX REPORTS
                const taxRes = await axios.get(
                    `${BASE_API}/reports/get_tax_reports.php`
                );

                // BOOKINGS / PAYMENTS
                const bookingRes = await axios.get(
                    `${BASE_API}/admin/get-master-records.php`
                );

                if (taxRes.data?.success) {
                    setReports(
                        Array.isArray(
                            taxRes.data.data
                        )
                            ? taxRes.data.data
                            : []
                    );
                }

                if (bookingRes.data?.success) {
                    setBookings(
                        Array.isArray(
                            bookingRes.data.data
                        )
                            ? bookingRes.data.data
                            : []
                    );
                }
            } catch (err) {
                console.error(
                    'Tax fetch error:',
                    err
                );

                setReports([]);
                setBookings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTaxData();
    }, [BASE_API]);

    // SAFE NUMBER
    const num = (val) => Number(val || 0);

    // CHART DATA
    const chartData = useMemo(() => {
        return [...reports]
            .sort(
                (a, b) =>
                    new Date(a.payment_date) -
                    new Date(b.payment_date)
            )
            .map((r) => ({
                date: r.payment_date
                    ? format(
                          new Date(
                              r.payment_date
                          ),
                          'dd MMM'
                      )
                    : 'N/A',

                Net:
                    num(r.total_revenue) -
                    (num(r.turnover_tax) +
                        num(r.vat_amount)),
            }));
    }, [reports]);

    // SEARCH FILTER
 const filteredReports = useMemo(() => {
    return bookings.filter((r) => {
        const search =
            `${r.reference_no || ''}
             ${r.customer_name || ''}
             ${r.customer_email || ''}
             ${r.vehicle_name || ''}
             ${r.payment_status || ''}`
                .toLowerCase();

        return search.includes(
            searchTerm.toLowerCase()
        );
    });
}, [bookings, searchTerm]);

    // PAGINATION
    const totalPages = Math.ceil(
        filteredReports.length /
            ITEMS_PER_PAGE
    );

    const paginatedReports = useMemo(() => {
        const start =
            (currentPage - 1) *
            ITEMS_PER_PAGE;

        const end = start + ITEMS_PER_PAGE;

        return filteredReports.slice(
            start,
            end
        );
    }, [filteredReports, currentPage]);

    // KPI TOTALS
    const totalRevenue = reports.reduce(
        (acc, curr) =>
            acc + num(curr.total_revenue),
        0
    );

    const totalTax = reports.reduce(
        (acc, curr) =>
            acc +
            num(curr.turnover_tax) +
            num(curr.vat_amount),
        0
    );

    const netRevenue =
        totalRevenue - totalTax;

    // EXPORT
    const handleExportExcel = () => {
    const excelData = bookings.map(
        (row, index) => {
            const gross = num(
                row.total_paid ||
                row.quoted_amount ||
                0
            );

            const turnoverTax =
                gross * 0.04;

            const vatAmount =
                gross * 0.16;

            const totalTax =
                turnoverTax + vatAmount;

            const net =
                gross - totalTax;

            return {
                '#': index + 1,

                'Booking ID':
                    row.reference_no ||
                    'N/A',

                Customer:
                    row.customer_name ||
                    'N/A',

                Vehicle:
                    row.vehicle_name ||
                    'N/A',

                'Booked On':
                    row.booked_on
                        ? format(
                              new Date(
                                  row.booked_on
                              ),
                              'MMMM dd, yyyy'
                          )
                        : 'N/A',

                'Pickup Date':
                    row.pickup_date ||
                    'N/A',

                'Return Date':
                    row.return_date ||
                    'N/A',

                'Gross Revenue':
                    gross,

                TOT: turnoverTax,

                VAT: vatAmount,

                'Total Tax':
                    totalTax,

                'Net Revenue': net,

                'Payment Status':
                    row.payment_status ||
                    'Pending',

                'Booking Status':
                    row.booking_status ||
                    'Pending',
            };
        }
    );

    exportTransactionsToExcel(
        excelData,
        format(
            new Date(),
            'MMMM-yyyy'
        )
    );
};

    if (loading)
        return (
            <CityDriveLoader message="Syncing ZRA Tax Records..." />
        );

    return (
        <div className="min-h-screen p-4 md:p-8 text-slate-900">
            <div className="max-w-8xl mx-auto space-y-8">

                {/* HERO */}
                <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 md:p-12 text-white shadow-[0_30px_80px_rgba(37,99,235,0.25)]">

                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-3xl rounded-full"></div>

                    <div className="relative z-10 flex flex-col xl:flex-row justify-between gap-10">

                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-6">
                                <FaShieldAlt className="text-blue-400" />

                                <span className="text-[11px] uppercase tracking-[0.2em] font-black text-blue-100">
                                    ZRA AUTOMATED
                                    COMPLIANCE
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none">
                                Tax
                                <span className="text-blue-400">
                                    Sync
                                </span>
                            </h1>

                            <p className="mt-5 text-slate-300 font-medium max-w-xl leading-relaxed">
                                Advanced revenue
                                intelligence, VAT
                                automation and
                                turnover tax
                                monitoring for
                                CityDrive Hire
                                operations.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <HeroBadge
                                    icon={
                                        <FaCheckCircle />
                                    }
                                    label="System Active"
                                />

                                <HeroBadge
                                    icon={
                                        <FaDatabase />
                                    }
                                    label={`${bookings.length} Bookings Synced`}
                                />

                                <HeroBadge
                                    icon={
                                        <FaCalendarAlt />
                                    }
                                    label="2026 Fiscal Year"
                                />
                            </div>
                        </div>

                        {/* SEARCH */}
                        <div className="xl:w-[360px]">
                            <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-[2rem] p-6">

                                <p className="text-[11px] uppercase tracking-[0.2em] font-black text-blue-200 mb-5">
                                    Search Booking
                                    Records
                                </p>

                                <div className="relative">
                                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                                    <input
                                        type="text"
                                        placeholder="Search booking, customer, vehicle..."
                                        value={
                                            searchTerm
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setSearchTerm(
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="w-full bg-white text-slate-900 rounded-2xl py-4 pl-12 pr-4 font-semibold outline-none focus:ring-4 focus:ring-blue-500/30"
                                    />
                                </div>

                                <div className="mt-6 bg-black/20 rounded-2xl p-5 border border-white/5">

                                    <div className="flex justify-between items-center">

                                        <div>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                                                NET
                                                POSITION
                                            </p>

                                            <h2 className="text-3xl font-black mt-2">
                                                K{' '}
                                                {netRevenue.toLocaleString()}
                                            </h2>
                                        </div>

                                        <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                            <FaChartLine className="text-xl" />
                                        </div>
                                    </div>

                                    <button
                                        onClick={
                                            handleExportExcel
                                        }
                                        className="w-full mt-5 bg-green-600 hover:bg-green-700 transition-all rounded-2xl py-4 flex items-center justify-center gap-3 font-black uppercase tracking-wider text-sm text-white shadow-lg shadow-green-900/20"
                                    >
                                        <FaFileExcel />

                                        Export
                                        Monthly
                                        Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <StatCard
                        title="Gross Revenue"
                        value={totalRevenue}
                        icon={<FaWallet />}
                        color="blue"
                    />

                    <StatCard
                        title="Tax Liability"
                        value={totalTax}
                        icon={
                            <FaCalculator />
                        }
                        color="orange"
                    />

                    <StatCard
                        title="Net Revenue"
                        value={netRevenue}
                        icon={<FaArrowUp />}
                        color="green"
                    />
                </div>

                {/* CHART */}
                <div className="bg-white rounded-[3rem] p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] border border-slate-100">

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

                        <div>
                            <p className="text-[11px] uppercase tracking-[0.2em] font-black text-blue-600">
                                Revenue Analytics
                            </p>

                            <h2 className="text-3xl font-black text-slate-900 mt-2">
                                Net Revenue
                                Timeline
                            </h2>
                        </div>

                        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-100 text-xs font-black uppercase tracking-widest">
                            <FaCheckCircle />
                            Live Synced Data
                        </div>
                    </div>

                    <div className="h-[340px]">
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <AreaChart
                                data={chartData}
                            >
                                <defs>
                                    <linearGradient
                                        id="gradientNet"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#2563eb"
                                            stopOpacity={
                                                0.3
                                            }
                                        />

                                        <stop
                                            offset="95%"
                                            stopColor="#2563eb"
                                            stopOpacity={
                                                0
                                            }
                                        />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={
                                        false
                                    }
                                    stroke="#e2e8f0"
                                />

                                <XAxis
                                    dataKey="date"
                                    axisLine={
                                        false
                                    }
                                    tickLine={
                                        false
                                    }
                                />

                                <YAxis
                                    axisLine={
                                        false
                                    }
                                    tickLine={
                                        false
                                    }
                                />

                                <Tooltip
                                    content={
                                        <CustomTooltip />
                                    }
                                />

                                <Area
                                    type="monotone"
                                    dataKey="Net"
                                    stroke="#2563eb"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#gradientNet)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">

                    <div className="px-8 py-7 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">

                        <div>
                            <p className="text-[11px] uppercase tracking-[0.2em] font-black text-blue-600">
                                Booking
                                Payments
                            </p>

                            <h2 className="text-2xl font-black mt-2">
                                Monthly Booking
                                Payments
                            </h2>
                        </div>

                        <div className="bg-slate-100 rounded-2xl px-5 py-3 flex items-center gap-3">
                            <FaCalendarAlt className="text-blue-600" />

                            <span className="font-bold text-slate-700 text-sm">
                                {
                                    filteredReports.length
                                }{' '}
                                Records
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1400px]">

                            <thead>
<tr className="border-b border-slate-100 bg-slate-50/70">

    <th className="text-left px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-black text-slate-400">
        Booking
    </th>

    <th className="text-left px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-black text-slate-400">
        Customer
    </th>

    <th className="text-left px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-black text-slate-400">
        Vehicle
    </th>

    <th className="text-left px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-black text-slate-400">
        Dates
    </th>

    <th className="text-right px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-black text-slate-400">
        Amount Paid
    </th>

    <th className="text-center px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-black text-slate-400">
        Method
    </th>

    <th className="text-center px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-black text-slate-400">
        Booking Status
    </th>

    <th className="text-center px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-black text-slate-400">
        Payment Status
    </th>

</tr>
</thead>

                            <tbody>
    {filteredReports.length > 0 ? (
        paginatedReports.map(
            (row, idx) => {

                const gross = num(
                    row.total_paid ||
                    row.quoted_amount ||
                    0
                );

                const turnoverTax =
                    gross * 0.04;

                const vatAmount =
                    gross * 0.16;

                const tax =
                    turnoverTax +
                    vatAmount;

                const net =
                    gross - tax;

                return (
                    <tr
                        key={idx}
                        className="border-b border-slate-50 hover:bg-blue-50/40 transition-all group"
                    >

                        {/* BOOKING */}
                        <td className="px-8 py-7">
                            <div>
                                <p className="font-black text-slate-900">
                                    {row.reference_no ||
                                        'N/A'}
                                </p>

                                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mt-1">
                                    {row.booked_on
                                        ? format(
                                              new Date(
                                                  row.booked_on
                                              ),
                                              'MMMM dd, yyyy'
                                          )
                                        : 'No Date'}
                                </p>
                            </div>
                        </td>

                        {/* CUSTOMER */}
                        <td className="px-8 py-7">
                            <div>
                                <p className="font-black text-slate-900">
                                    {row.customer_name ||
                                        'Unknown'}
                                </p>

                                <p className="text-xs text-slate-400 mt-1">
                                    {row.customer_email ||
                                        ''}
                                </p>
                            </div>
                        </td>

                        {/* VEHICLE */}
                        <td className="px-8 py-7">
                            <div>
                                <p className="font-black text-slate-900">
                                    {row.vehicle_name ||
                                        'Vehicle'}, {row.plate_number || 'N/A'}
                                </p>

                                <p className="text-xs text-slate-400 mt-1">
                                    {row.transmission ||
                                        ''}
                                </p>
                            </div>
                        </td>

                        {/* DATES */}
                        <td className="px-8 py-7">
                            <div className="text-sm font-bold text-slate-700">
                                {row.pickup_date
                                    ? format(
                                          new Date(
                                              row.pickup_date
                                          ),
                                          'dd MMM'
                                      )
                                    : '--'}

                                {' → '}

                                {row.return_date
                                    ? format(
                                          new Date(
                                              row.return_date
                                          ),
                                          'dd MMM'
                                      )
                                    : '--'}
                            </div>
                        </td>

                   {/* PAYMENT */}
<td className="px-8 py-7 text-right font-black text-slate-700 font-mono">
    K {gross.toLocaleString()}
</td>

{/* METHOD */}
<td className="px-8 py-7 text-center">
    <div className="inline-flex px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-700">
        {row.payment_method || 'N/A'}
    </div>
</td>

{/* BOOKING STATUS */}
<td className="px-8 py-7 text-center">
    <div className="inline-flex px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-700">
        {row.booking_status || 'pending'}
    </div>
</td>

{/* PAYMENT STATUS */}
<td className="px-8 py-7 text-center">
    <div
        className={`inline-flex px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider ${
            row.payment_status === 'Verified'
                ? 'bg-green-100 text-green-700'
                : row.payment_status === 'Failed'
                ? 'bg-red-100 text-red-700'
                : 'bg-orange-100 text-orange-700'
        }`}
    >
        {row.payment_status || 'Pending'}
    </div>
</td>

                    </tr>
                );
            }
        )
    ) : (
        <tr>
            <td
                colSpan={9}
                className="py-20 text-center"
            >
                <div className="flex flex-col items-center">

                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-5">
                        <FaSearch className="text-2xl text-slate-400" />
                    </div>

                    <h3 className="text-xl font-black text-slate-700">
                        No Records Found
                    </h3>

                    <p className="text-slate-400 mt-2">
                        Try another search keyword.
                    </p>
                </div>
            </td>
        </tr>
    )}
</tbody>
                        </table>

                        {/* PAGINATION */}
                        <div className="px-8 py-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-5">

                            <div className="text-sm font-bold text-slate-500">
                                Showing{' '}
                                <span className="text-slate-900">
                                    {
                                        paginatedReports.length
                                    }
                                </span>{' '}
                                of{' '}
                                <span className="text-slate-900">
                                    {
                                        filteredReports.length
                                    }
                                </span>{' '}
                                records
                            </div>

                            <div className="flex items-center gap-3">

                                <button
                                    onClick={() =>
                                        setCurrentPage(
                                            (
                                                prev
                                            ) =>
                                                Math.max(
                                                    prev -
                                                        1,
                                                    1
                                                )
                                        )
                                    }
                                    disabled={
                                        currentPage ===
                                        1
                                    }
                                    className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                                >
                                    <FaChevronLeft />
                                </button>

                                <div className="px-5 py-3 rounded-2xl bg-blue-600 text-white font-black text-sm min-w-[120px] text-center">
                                    Page{' '}
                                    {
                                        currentPage
                                    }{' '}
                                    /{' '}
                                    {totalPages ||
                                        1}
                                </div>

                                <button
                                    onClick={() =>
                                        setCurrentPage(
                                            (
                                                prev
                                            ) =>
                                                Math.min(
                                                    prev +
                                                        1,
                                                    totalPages
                                                )
                                        )
                                    }
                                    disabled={
                                        currentPage ===
                                        totalPages
                                    }
                                    className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function HeroBadge({ icon, label }) {
    return (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">

            <span className="text-blue-400">
                {icon}
            </span>

            <span className="text-xs font-black uppercase tracking-wider text-white">
                {label}
            </span>
        </div>
    );
}

function StatCard({
    title,
    value,
    icon,
    color,
}) {
    const styles = {
        blue: {
            bg: 'bg-blue-50',
            text: 'text-blue-700',
            icon: 'bg-blue-600',
        },

        orange: {
            bg: 'bg-orange-50',
            text: 'text-orange-700',
            icon: 'bg-orange-500',
        },

        green: {
            bg: 'bg-green-50',
            text: 'text-green-700',
            icon: 'bg-green-600',
        },
    };

    return (
        <div
            className={`${styles[color].bg} rounded-[2.5rem] p-8 border border-white shadow-[0_20px_50px_rgba(15,23,42,0.06)] hover:-translate-y-1 transition-all`}
        >
            <div className="flex items-center justify-between mb-8">

                <div
                    className={`w-14 h-14 rounded-2xl ${styles[color].icon} text-white flex items-center justify-center text-xl shadow-lg`}
                >
                    {icon}
                </div>

                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                    LIVE
                </span>
            </div>

            <p className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-400 mb-3">
                {title}
            </p>

            <h2
                className={`text-4xl font-black tracking-tight ${styles[color].text}`}
            >
                <span className="text-lg opacity-50 mr-1">
                    K
                </span>

                {Number(
                    value || 0
                ).toLocaleString()}
            </h2>
        </div>
    );
}

function CustomTooltip({
    active,
    payload,
}) {
    if (
        active &&
        payload &&
        payload.length
    ) {
        return (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl">

                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-400 mb-2">
                    {
                        payload[0].payload
                            .date
                    }
                </p>

                <h3 className="text-2xl font-black text-white">
                    K{' '}
                    {Number(
                        payload[0].value ||
                            0
                    ).toLocaleString()}
                </h3>

                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-2">
                    Net Revenue
                    Position
                </p>
            </div>
        );
    }

    return null;
}