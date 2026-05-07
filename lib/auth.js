import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const res = await axios.post(`${BASE_API}/users/login.php`, {
                        email: credentials.email,
                        password: credentials.password,
                    });

                    if (res.data?.success) {
                        return {
                            id: res.data.user.id,
                            partner_id: res.data.user.partner_id,
                            name: res.data.user.name,
                            email: res.data.user.email,
                            role: res.data.user.role,
                            kyc_status: res.data.user.kyc_status ?? null,
                            accessToken: res.data.token,
                        };
                    }
                    return null;
                } catch (err) {
                    throw new Error(err.response?.data?.message || "Invalid email or password");
                }
            },
        }),
    ],
    session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.partner_id = user.partner_id;
                token.role = user.role;
                token.kyc_status = user.kyc_status;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = Number(token.id || token.sub);
            session.user.partner_id = token.partner_id;
            session.user.role = token.role;
            session.user.kyc_status = token.kyc_status;
            session.accessToken = token.accessToken;
            return session;
        },
    },
    pages: { signIn: "/auth/signin" },
    secret: process.env.NEXTAUTH_SECRET,
};