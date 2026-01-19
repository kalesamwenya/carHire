'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FaSpinner, FaCircle, FaHistory, FaTimes } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';

// Dynamically import Map components
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then((mod) => mod.Polyline), { ssr: false });

export default function MapPage() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);
    const [historyPath, setHistoryPath] = useState([]);
    const [selectedCarName, setSelectedCarName] = useState(null);

    const center = useMemo(() => [-15.4167, 28.2833], []); 

     const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";


    useEffect(() => {
        setIsClient(true);
        
        const initLeaflet = async () => {
            const L = (await import('leaflet')).default;
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });
        };
        initLeaflet();

        const fetchLivePositions = async () => {
            try {
                const res = await fetch(`${BASE_API}/admin/get_cars.php`);
                const json = await res.json();
                if (json.success) setVehicles(json.cars);
            } catch (error) {
                console.error("Tracking error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLivePositions();
        const interval = setInterval(fetchLivePositions, 30000);
        return () => clearInterval(interval);
    }, []);

    const getStatus = (updatedAt) => {
        if (!updatedAt) return false;
        const diffInMinutes = (new Date() - new Date(updatedAt)) / 1000 / 60;
        return diffInMinutes < 10;
    };

    const onlineCount = vehicles.filter(v => v.latitude && v.longitude && getStatus(v.updated_at)).length;
    const offlineCount = vehicles.length - onlineCount;

    if (!isClient || loading) return (
        <div className="h-96 flex items-center justify-center text-green-600">
            <FaSpinner className="animate-spin text-3xl" />
        </div>
    );

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Live Fleet Tracking</h1>
                    <p className="text-sm text-gray-500">Real-time GPS locations for CityDriveHire fleet.</p>
                </div>
                <div className="flex gap-4">
                    {historyPath.length > 0 && (
                        <button onClick={() => {setHistoryPath([]); setSelectedCarName(null);}} className="flex items-center bg-red-50 text-red-600 px-3 py-2 rounded-lg border border-red-100 text-xs font-bold hover:bg-red-100 transition-colors">
                            <FaTimes className="mr-2" /> Clear {selectedCarName} Path
                        </button>
                    )}
                    <div className="flex gap-4 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
                        <span className="flex items-center text-xs font-bold text-gray-600">
                            <FaCircle className="text-green-500 mr-2" /> {onlineCount} Online
                        </span>
                        <span className="flex items-center text-xs font-bold text-gray-600">
                            <FaCircle className="text-gray-300 mr-2" /> {offlineCount} Offline
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 shadow-lg z-0 relative bg-gray-50">
                {/* CRITICAL FIX: 
                  The key="main-fleet-map" ensures React doesn't try to 
                  re-use an old container during HMR (Hot Module Replacement)
                */}
                <MapContainer 
                    key="main-fleet-map"
                    center={center} 
                    zoom={13} 
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    
                    {historyPath.length > 0 && (
                        <Polyline positions={historyPath} pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.6, dashArray: '5, 10' }} />
                    )}
                    
                    {vehicles.filter(v => v.latitude && v.longitude).map((v) => {
                        const isOnline = getStatus(v.updated_at);
                        return (
                            <Marker key={`car-${v.id}`} position={[parseFloat(v.latitude), parseFloat(v.longitude)]}>
                                <Popup>
                                    <div className="p-1 min-w-[150px]">
                                        <div className="flex justify-between items-center border-b pb-1 mb-1">
                                            <h3 className="font-bold text-gray-900">{v.name}</h3>
                                            <FaCircle className={`text-[8px] ${isOnline ? 'text-green-500' : 'text-gray-300'}`} />
                                        </div>
                                        <p className="text-[10px] text-gray-500 uppercase font-mono">{v.plate_number}</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${Number(v.mileage) > 0 && isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            <span className="text-xs font-medium">
                                                {!isOnline ? 'Connection Lost' : (Number(v.mileage) > 0 ? 'In Motion' : 'Parked')}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={async () => {
                                                const res = await fetch(`http://api.citydrivehire.local/admin/get_vehicle_history.php?car_id=${v.id}`);
                                                const json = await res.json();
                                                if (json.success) {
                                                    setHistoryPath(json.history.map(pt => [parseFloat(pt.latitude), parseFloat(pt.longitude)]));
                                                    setSelectedCarName(v.name);
                                                }
                                            }}
                                            className="mt-3 w-full flex items-center justify-center gap-2 text-xs bg-blue-50 text-blue-600 py-1.5 rounded font-bold"
                                        >
                                            <FaHistory size={10} /> Route Today
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
}