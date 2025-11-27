// app/api/users/route.js
import { NextResponse } from 'next/server';

const USER = { id: 1, name: 'Godfrey', email: 'godfrey@example.com', driver_license: 'GZ-123456' };

export async function GET(request) {
    const url = new URL(request.url);
    if (url.searchParams.get('me') === 'true') {
        return NextResponse.json(USER);
    }
    return NextResponse.json([USER]);
}
