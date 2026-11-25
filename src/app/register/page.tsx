"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== password2) {
      setError("Пароли не совпадают");
      return;
    }
    if (password.length < 8) {
      setError("Пароль минимум 8 символов");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Ошибка");
      setLoading(false);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl p-6 shadow border border-cream-200">
        <h1 className="text-xl font-bold text-center mb-6">Регистрация</h1>
        <form onSubmit={submit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="block text-sm mb-1">Имя</label>
            <input required minLength={2} value={name} onChange={(e) => setName(e.target.value)}
              className="w-full border border-sage-200 rounded-xl px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-sage-200 rounded-xl px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Пароль (мин. 8)</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-sage-200 rounded-xl px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Повтор пароля</label>
            <input type="password" required value={password2} onChange={(e) => setPassword2(e.target.value)}
              className="w-full border border-sage-200 rounded-xl px-3 py-2" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-sage-600 text-white rounded-xl font-medium disabled:opacity-50">
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>
        <p className="text-center text-sm text-sage-600 mt-4">
          Уже есть аккаунт? <Link href="/login" className="underline">Войти</Link>
        </p>
      </div>
    </div>
  );
}
