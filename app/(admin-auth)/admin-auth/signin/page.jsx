"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function AdminSignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email: email.trim().toLowerCase(),
      password,
    });

    if (res?.ok) {
      // small delay to let cookie be written
      await new Promise((r) => setTimeout(r, 100));
      router.push("/admin");
    } else {
      setError(res?.error || "Authentication failed");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Admin Sign In</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full mt-1 px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="text-sm">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full mt-1 px-3 py-2 border rounded" />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button disabled={busy} type="submit" className="w-full bg-amber-500 text-white py-2 rounded">
            {busy ? "Signing in…" : "Sign in as Admin"}
          </button>

          <div className="text-xs text-center text-gray-500">
            Need an account? <Link href="/admin-auth/admin-auth/signup">Create admin account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
