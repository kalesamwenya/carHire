import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Ensure this path points to your lib folder

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };