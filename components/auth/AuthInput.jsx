'use client';

export default function AuthInput({
                                      label,
                                      type = 'text',
                                      value,
                                      onChange,
                                      placeholder,
                                      icon: Icon,
                                      error // Added error prop to handle validation styling
                                  }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-900">
                {label}
            </label>
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    className={`
                        block w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none shadow-sm transition-all duration-200
                        ${Icon ? 'pl-10' : ''}
                        ${error
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                        : 'border-gray-200 focus:border-green-600 focus:ring-4 focus:ring-green-50'
                    }
                    `}
                    placeholder={placeholder}
                />
            </div>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
}