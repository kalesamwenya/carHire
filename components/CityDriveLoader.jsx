import React from 'react';
import { FaSpinner } from 'react-icons/fa';

/**
 * @param {string} message - The text to display below the spinner
 * @param {boolean} fullScreen - Whether to take up the whole screen or just fill its container
 */
const CityDriveLoader = ({ message = "Loading Emit Fleet...", fullScreen = true }) => {
  return (
    <div className={`flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm transition-all duration-500 ${fullScreen ? 'h-screen w-full fixed inset-0 z-[100]' : 'py-20 w-full'}`}>
      <div className="relative flex items-center justify-center">
        {/* Outer Pulsing Ring */}
        <div className="absolute w-16 h-16 border-4 border-green-600/20 rounded-full animate-ping"></div>
        
        {/* Main Spinner */}
        <div className="w-12 h-12 border-4 border-gray-100 border-t-green-600 rounded-full animate-spin"></div>
        
        {/* Center Dot */}
        <div className="absolute w-2 h-2 bg-green-700 rounded-full"></div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-1">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-green-700 animate-pulse">
          CityDriveHire
        </h2>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
          {message}
        </p>
      </div>

      {/* Subtle Bottom Branding */}
      {fullScreen && (
        <div className="absolute bottom-10">
          <p className="text-[8px] text-gray-300 font-bold uppercase tracking-widest">
            Powered by CityDriveHire
          </p>
        </div>
      )}
    </div>
  );
};

export default CityDriveLoader;