"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) router.push("/login?from=/account");
        else setUser(d.user);
      });
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  if (!user) return <p className="text-center py-20 text-sage-600">Загрузка...</p>;

  return (
    <div className="max-w-sm mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl p-6 shadow border border-cream-200 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-sage-500 text-white text-2xl font-bold flex items-center justify-center mb-4">
          {user.name[0].toUpperCase()}
        </div>
        <h1 className="text-xl font-bold mb-4">Мой аккаунт</h1>
        <div className="text-left space-y-3 mb-6">
          <div className="bg-cream-50 rounded-xl p-3">
            <div className="text-xs text-sage-500">Имя</div>
            <div className="font-medium">{user.name}</div>
          </div>
          <div className="bg-cream-50 rounded-xl p-3">
            <div className="text-xs text-sage-500">Email</div>
            <div className="font-medium">{user.email}</div>
          </div>
        </div>
        <Link href="/recipes/new"
          className="block w-full py-2.5 bg-sage-600 text-white rounded-xl font-medium mb-3">
          Добавить рецепт
        </Link>
        <button onClick={logout}
          className="w-full py-2.5 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50">
          Выйти
        </button>
      </div>
    </div>
  );
}
