'use client';

import { FaExclamationTriangle, FaRedo, FaHome, FaTimesCircle } from 'react-icons/fa';

export default function ErrorCard({ 
    title, 
    message, 
    type = 'error', // 'error' | 'warning' 
    onRetry,        // Optional callback for a "Try Again" button
    actions         // Optional override for custom buttons
}) {
    
    // Configuration based on severity type
    const config = {
        error: {
            icon: <FaTimesCircle className="w-10 h-10 text-red-600" />,
            bg: 'bg-red-50',
            border: 'border-red-100',
            titleColor: 'text-red-900',
            defaultTitle: 'Something went wrong'
        },
        warning: {
            icon: <FaExclamationTriangle className="w-10 h-10 text-yellow-600" />,
            bg: 'bg-yellow-50',
            border: 'border-yellow-100',
            titleColor: 'text-yellow-900',
            defaultTitle: 'Page not found'
        }
    };

    const theme = config[type] || config.error;
    const displayTitle = title || theme.defaultTitle;
    const displayMessage = message || "We encountered an unexpected issue. Please try again or return home.";

    // Default Reload handler if no specific retry function is passed
    const handleReload = () => {
        if (typeof window !== 'undefined') {
            window.location.reload();
        }
    };

    return (
        <div className="min-h-[50vh] flex items-center justify-center p-4">
            <div className={`max-w-md w-full bg-white rounded-2xl shadow-xl border ${theme.border} p-8 text-center animate-fade-in`}>
                
                {/* Icon Bubble */}
                <div className={`mx-auto w-20 h-20 rounded-full ${theme.bg} flex items-center justify-center mb-6`}>
                    {theme.icon}
                </div>

                {/* Text Content */}
                <h2 className={`text-2xl font-bold ${theme.titleColor} mb-3`}>
                    {displayTitle}
                </h2>
                
                <p className="text-gray-600 mb-8 leading-relaxed">
                    {displayMessage}
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {actions ? actions : (
                        <>
                            {/* Retry / Reload Button */}
                            <button 
                                onClick={onRetry || handleReload}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
                            >
                                <FaRedo className={!onRetry ? "text-gray-400" : ""} />
                                {onRetry ? 'Try Again' : 'Reload Page'}
                            </button>

                            {/* Home Button - Using <a> for hard navigation/reset */}
                            <a 
                                href="/" 
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition-all"
                            >
                                <FaHome />
                                Return Home
                            </a>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}