"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function PartnerSignUp() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const res = await fetch("http://api.citydrivehire.local/partners/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, email, password, role: "partner" }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        await signIn("credentials", { redirect: false, email, password });
        await new Promise((r) => setTimeout(r, 150));
        router.push("/partner");
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
        <h2 className="text-2xl font-bold mb-4">Partner Sign Up</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company Name" required className="w-full px-3 py-2 border rounded" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full px-3 py-2 border rounded" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full px-3 py-2 border rounded" />

          {message && <div className="text-sm text-red-600">{message}</div>}

          <button disabled={busy} className="w-full bg-green-600 text-white py-2 rounded">
            {busy ? "Creating…" : "Create Partner Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
