'use client';
import { useEffect } from 'react';
import axios from 'axios';

export default function VisitorTracker() {
    useEffect(() => {
        const trackVisitor = async () => {
            // 1. Check if tracked today to save server bandwidth
            const lastTracked = localStorage.getItem('city_drive_last_tracked');
            const today = new Date().toDateString();
            if (lastTracked === today) return;

            // 2. Handle Unique Visitor ID
            let vId = localStorage.getItem('city_drive_v_id');
            if (!vId) {
                vId = 'uid-' + Math.random().toString(36).substr(2, 9) + Date.now();
                localStorage.setItem('city_drive_v_id', vId);
            }

            // 3. Device Detection
            const ua = window.navigator.userAgent;
            const platform = window.navigator.platform;
            
            const getOS = () => {
                if (ua.indexOf("Win") !== -1) return "Windows";
                if (ua.indexOf("Mac") !== -1) return "MacOS";
                if (ua.indexOf("Linux") !== -1) return "Linux";
                if (ua.indexOf("Android") !== -1) return "Android";
                if (ua.indexOf("like Mac") !== -1) return "iOS";
                return "Unknown OS";
            };

            const getDevice = () => {
                if (/tablet|ipad|playbook|silk/i.test(ua)) return "Tablet";
                if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
                    return "Mobile";
                }
                return "Desktop";
            };

            const basePayload = {
                visitor_id: vId,
                device: getDevice(),
                os: getOS(),
                platform: platform,
                lat: null,
                lng: null
            };

            const sendData = async (payload) => {
                const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";
                try {
                    const res = await axios.post(`${BASE_API}/reports/log_detailed_visit.php`, payload);
                    if (res.data.status === "tracked") {
                        localStorage.setItem('city_drive_last_tracked', today);
                    }
                } catch (err) {
                    console.error("Analytics Error:", err);
                }
            };

            // 4. Geolocation & Dispatch
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                        sendData({
                            ...basePayload,
                            lat: pos.coords.latitude,
                            lng: pos.coords.longitude
                        });
                    },
                    () => sendData(basePayload), 
                    { timeout: 5000 }
                );
            } else {
                sendData(basePayload);
            }
        };

        trackVisitor();
    }, []);

    return null;
}