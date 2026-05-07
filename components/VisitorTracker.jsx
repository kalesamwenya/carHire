'use client';
import { useEffect } from 'react';
import axios from 'axios';
import { useSession } from "next-auth/react";

export default function VisitorTracker() {
    const { data: session } = useSession();

    useEffect(() => {
        const trackVisitor = async () => {
            // 1. Bandwidth check
            const lastTracked = localStorage.getItem('city_drive_last_tracked');
            const today = new Date().toDateString();
            
            // If tracked today AND no user just logged in, skip
            // (We track again if a user just logged in to link the ID)
            if (lastTracked === today && !session?.user?.id) return;

            // 2. Handle Unique Visitor ID
            let vId = localStorage.getItem('city_drive_v_id');
            if (!vId) {
                vId = 'uid-' + Math.random().toString(36).substr(2, 9) + Date.now();
                localStorage.setItem('city_drive_v_id', vId);
            }

            // 3. Metadata Detection
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
                user_id: session?.user?.id || null, // Link to Next-Auth session
                device: getDevice(),
                os: getOS(),
                platform: platform,
                lat: 0, // Using 0 instead of null to prevent PHP DB errors
                lng: 0
            };
const sendData = async (payload) => {
    const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";
    try {
        const res = await axios.post(`${BASE_API}/reports/log_detailed_visit.php`, payload);
        
        if (res.data.status === "tracked") {
            localStorage.setItem('city_drive_last_tracked', today);
        }
    } catch (err) {
        // This will print the actual error text even if CORS is acting up
        if (err.response) {
            // Server responded with a code (404, 500, etc)
            console.error("Server Error:", err.response.data);
        } else if (err.request) {
            // Request was made but no response received (CORS or Network)
            console.error("Network/CORS Error: No response from API.");
        } else {
            console.error("Setup Error:", err.message);
        }
    }
};

            // 4. Geolocation Logic
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        sendData({
                            ...basePayload,
                            lat: pos.coords.latitude,
                            lng: pos.coords.longitude
                        });
                    },
                    () => sendData(basePayload), 
                    { timeout: 3000 } // Shortened timeout
                );
            } else {
                sendData(basePayload);
            }
        };

        trackVisitor();
    }, [session]); // Re-run if session status changes

    return null;
}