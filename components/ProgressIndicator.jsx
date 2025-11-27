// components/ProgressIndicator.jsx
import { FaCheck } from 'react-icons/fa';

export default function ProgressIndicator({ currentStep = 1 }) {
    const steps = [
        { id: 1, label: 'Select Car' },
        { id: 2, label: 'Your Details' },
        { id: 3, label: 'Payment' },
        { id: 4, label: 'Confirmation' }
    ];

    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-between relative max-w-3xl mx-auto px-4">
                
                {/* The Background Line (Gray) */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
                
                {/* The Active Progress Line (Green) */}
                <div 
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-green-600 -z-10 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step) => {
                    const isCompleted = step.id < currentStep;
                    const isActive = step.id === currentStep;

                    return (
                        <div key={step.id} className="flex flex-col items-center relative group">
                            {/* Circle Indicator */}
                            <div 
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                                    isCompleted 
                                        ? 'bg-green-600 border-green-600 text-white' // Finished
                                        : isActive 
                                            ? 'bg-white border-green-600 text-green-700 shadow-md scale-110' // Current
                                            : 'bg-white border-gray-200 text-gray-400' // Pending
                                }`}
                            >
                                {isCompleted ? (
                                    <FaCheck className="w-4 h-4" />
                                ) : (
                                    <span className={`text-sm font-bold ${isActive ? 'text-green-700' : 'text-gray-500'}`}>
                                        {step.id}
                                    </span>
                                )}
                            </div>

                            {/* Text Label */}
                            <div className={`absolute top-12 whitespace-nowrap text-xs sm:text-sm font-medium transition-colors duration-300 ${
                                isActive ? 'text-green-700' : 'text-gray-500'
                            }`}>
                                {step.label}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Spacer to prevent text from being cut off at bottom */}
            <div className="h-6"></div>
        </div>
    );
}