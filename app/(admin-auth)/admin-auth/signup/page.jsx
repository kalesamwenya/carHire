"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminSignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const res = await fetch("http://api.citydrivehire.local/users/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "admin" }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // auto sign-in after successful registration
        await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
        // delay and redirect
        await new Promise((r) => setTimeout(r, 150));
        router.push("/admin");
      } else {
        setMessage(data.message || "Registration failed");
        setBusy(false);
      }
    } catch (err) {
      setMessage(err.message || "Registration error");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Admin Sign Up</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required className="w-full px-3 py-2 border rounded" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full px-3 py-2 border rounded" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full px-3 py-2 border rounded" />

          {message && <div className="text-sm text-red-600">{message}</div>}

          <button disabled={busy} className="w-full bg-amber-500 text-white py-2 rounded">
            {busy ? "Creating…" : "Create Admin Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
