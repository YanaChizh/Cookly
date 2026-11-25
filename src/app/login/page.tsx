"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function Form() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Ошибка");
      setLoading(false);
      return;
    }
    router.push(from);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-sage-200 rounded-xl px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm mb-1">Пароль</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-sage-200 rounded-xl px-3 py-2" />
      </div>
      <button type="submit" disabled={loading}
        className="w-full py-2.5 bg-sage-600 text-white rounded-xl font-medium disabled:opacity-50">
        {loading ? "Вход..." : "Войти"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl p-6 shadow border border-cream-200">
        <h1 className="text-xl font-bold text-center mb-6">Вход в Cookly</h1>
        <Suspense><Form /></Suspense>
        <p className="text-center text-sm text-sage-600 mt-4">
          Нет аккаунта? <Link href="/register" className="underline">Регистрация</Link>
        </p>
      </div>
    </div>
  );
}
