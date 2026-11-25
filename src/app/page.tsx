import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ category?: string }> };

export default async function HomePage({ searchParams }: Props) {
  const { category = "Все" } = await searchParams;

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const categoryNames = ["Все", ...categories.map((c) => c.name)];

  const recipes = await prisma.recipe.findMany({
    where: category !== "Все" ? { category: { name: category } } : undefined,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div>
      <section className="bg-gradient-to-b from-cream-100 to-cream-50 border-b border-sage-200 py-14 text-center px-4">
        <h1 className="text-4xl font-bold text-sage-900 mb-3">🥞 Cookly</h1>
        <p className="text-sage-700 max-w-xl mx-auto mb-6">
          Уютная коллекция рецептов. Смотрите готовые блюда или добавляйте свои.
        </p>
        <Link
          href="/recipes/new"
          className="inline-block px-6 py-2.5 bg-sage-600 text-white rounded-xl font-medium hover:bg-sage-700"
        >
          Добавить рецепт
        </Link>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-wrap gap-2 justify-center">
        {categoryNames.map((c) => (
          <Link
            key={c}
            href={c === "Все" ? "/" : `/?category=${encodeURIComponent(c)}`}
            className={`px-4 py-1.5 rounded-full text-sm ${
              category === c
                ? "bg-sage-600 text-white"
                : "bg-white border border-sage-200 text-sage-700 hover:bg-sage-50"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {recipes.length === 0 && (
          <p className="col-span-full text-center text-sage-600 py-10">Рецептов пока нет</p>
        )}
        {recipes.map((r) => (
          <Link
            key={r.id}
            href={`/recipes/${r.id}`}
            className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg border border-cream-200 transition"
          >
            <div className="relative h-44 bg-cream-100">
              <Image src={r.imageUrl} alt={r.title} fill className="object-cover" unoptimized />
            </div>
            <div className="p-4">
              <span className="text-xs bg-sage-100 text-sage-700 px-2 py-0.5 rounded-full">
                {r.category.name}
              </span>
              <h2 className="font-semibold text-sage-900 mt-2 line-clamp-2">{r.title}</h2>
              <p className="text-sm text-sage-600 mt-1">
                ⏱️ {r.cookTime} мин · {r.difficulty}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
