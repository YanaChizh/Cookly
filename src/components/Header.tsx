"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => setUser(null));
  }, [path]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  const link = (href: string, text: string) => (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-lg text-sm ${
        path === href ? "bg-sage-200 text-sage-800" : "text-sage-700 hover:bg-sage-100"
      }`}
    >
      {text}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-cream-50 border-b border-sage-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-sage-800">
          <span>🥞</span> Cookly
        </Link>
        <nav className="flex items-center gap-1 flex-wrap">
          {link("/", "Главная")}
          {link("/recipes/new", "Добавить рецепт")}
          {user ? (
            <>
              {link("/account", "Мой аккаунт")}
              <button onClick={logout} className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                Выйти
              </button>
            </>
          ) : (
            <>
              {link("/login", "Войти")}
              <Link href="/register" className="px-3 py-1.5 rounded-lg text-sm bg-sage-600 text-white hover:bg-sage-700">
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
