import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        // 1. Basic Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // 2. Check if user exists (Mock Logic)
        // In a real DB, you would do: await db.user.findUnique({ where: { email } })
        if (email === 'kaleb@example.com') { // Mock check against the user we hardcoded earlier
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 409 }
            );
        }

        // 3. Create User (Mock Logic)
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            // In production, ALWAYS hash passwords (e.g., using bcrypt)
            password,
            role: 'user'
        };

        // In a real app, you would save to DB here.
        // For this demo, we just simulate success.

        return NextResponse.json(
            { message: 'User created successfully', user: newUser },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}