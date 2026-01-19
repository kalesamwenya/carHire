import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayoutClient from "@/components/dashboard/DashboardLayoutClient";

export default async function CustomerLayout({ children }) {
  const session = await getServerSession(authOptions);

  // 1. Not logged in
  if (!session) {
    redirect("/auth/signin");
  }

  // 2. Normalize role
  const role = session.user?.role?.toLowerCase();

  // 3. Missing role = force re-login
  if (!role) {
    redirect("/auth/signin");
  }

  // 4. Role protection
  if (role !== "user") {
    if (role === "partner") redirect("/partner");
    if (role === "admin") redirect("/admin");

    // fallback safety
    redirect("/auth/signin");
  }

  return (
    <DashboardLayoutClient user={session.user}>
      {children}
    </DashboardLayoutClient>
  );
}
