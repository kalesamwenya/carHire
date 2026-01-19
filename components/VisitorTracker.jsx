'use client';
import { useEffect } from 'react';
import axios from 'axios';

export default function VisitorTracker() {
    useEffect(() => {
        const trackVisitor = async () => {
            // 1. Handle Unique Visitor ID
            let vId = localStorage.getItem('city_drive_v_id');
            if (!vId) {
                vId = 'uid-' + Math.random().toString(36).substr(2, 9) + Date.now();
                localStorage.setItem('city_drive_v_id', vId);
            }

            // 2. Comprehensive OS & Device Detection
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

            // 3. Geolocation & Dispatch
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                        const fullPayload = {
                            ...basePayload,
                            lat: pos.coords.latitude,
                            lng: pos.coords.longitude
                        };
                        sendData(fullPayload);
                    },
                    () => sendData(basePayload), // If user denies GPS
                    { timeout: 10000 }
                );
            } else {
                sendData(basePayload);
            }
        };

         const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

        const sendData = async (payload) => {
            try {
                await axios.post(`${BASE_API}/reports/log_detailed_visit.php`, payload);
            } catch (err) {
                console.error("Analytics Error:", err);
            }
        };

        trackVisitor();
    }, []);

    return null; // This component doesn't render anything UI-wise
}