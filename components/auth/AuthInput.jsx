'use client';

export default function AuthInput({
                                      label,
                                      type = 'text',
                                      value,
                                      onChange,
                                      placeholder,
                                      icon: Icon
                                  }) {
    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-green-500 focus:ring-green-500 sm:text-sm ${
                        Icon ? 'pl-10' : ''
                    }`}
                    placeholder={placeholder}
                    required
                />
            </div>
        </div>
    );
}