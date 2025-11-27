import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextResponse } from 'next/server';
import { findUserByEmail } from '../../users/route';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                const user = findUserByEmail(credentials.email);
                if (!user) return null;
                // NOTE: mock password check — replace with hashed check in production
                if (credentials.password === user.password) {
                    const { password, ...safe } = user;
                    return safe;
                }
                return null;
            }
        })
    ],
    session: { strategy: 'jwt' },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user;
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET || 'dev-secret',
    pages: {
        signIn: '/api/auth/signin' // optional custom page; default NextAuth UI will be used if not provided
    }
});

export { handler as GET, handler as POST };
