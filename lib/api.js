// lib/api.js
const API_BASE_URL = 'https://api.citydrivehire.com';

export async function apiFetch(path, options = {}) {
    // If the path doesn't start with http, prepend our API base
    const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;

    const defaultOptions = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    return fetch(url, defaultOptions);
}