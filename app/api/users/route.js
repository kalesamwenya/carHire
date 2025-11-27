import { NextResponse } from 'next/server';

// Mock User Data
const users = [
    {
        id: '1',
        name: 'Kaleb Mwenya',
        email: 'kaleb@example.com',
        password: 'password', // In a real app, use hashed passwords
        driver_license: 'DL-8829-ZMB',
        role: 'user',
        image: null
    }
];

// 1. API Handler for GET /api/users
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const me = searchParams.get('me');

    // If ?me=true, return the mock logged-in user
    if (me === 'true') {
        // In a real app, you would verify the session/token here.
        // For this prototype, we return the first user to simulate a logged-in state.
        return NextResponse.json(users[0]);
    }

    return NextResponse.json(users);
}

// 2. Helper function exported for NextAuth (Fixes your import error)
export function findUserByEmail(email) {
    return users.find(u => u.email === email);
}