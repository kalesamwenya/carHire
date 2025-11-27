import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUserByEmail } from "../../users/route";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "kaleb@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // 1. Use the helper we just exported
                const user = findUserByEmail(credentials?.email);

                // 2. Simple password check (Mock)
                if (user && user.password === credentials.password) {
                    return { id: user.id, name: user.name, email: user.email };
                }
                
                return null;
            }
        })
    ],
    pages: {
        signIn: '/auth/signin', // Optional: Custom sign-in page
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "your-secret-key-here", // Required for production
});

export { handler as GET, handler as POST };