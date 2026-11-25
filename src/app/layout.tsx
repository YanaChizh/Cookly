import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "Cookly — Рецепты",
  description: "Учебный проект: просмотр и добавление рецептов",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
