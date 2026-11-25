import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function RecipePage({ params }: Props) {
  const { id } = await params;
  const recipe = await prisma.recipe.findUnique({ where: { id } });
  if (!recipe) notFound();

  const session = await getSession();
  // Показываем кнопку удаления, если пользователь вошёл
  // и рецепт либо его, либо стартовый (без автора)
  const canDelete =
    session && (!recipe.authorId || recipe.authorId === session.id);

  const ingredients: string[] = JSON.parse(recipe.ingredients);
  const steps: string[] = JSON.parse(recipe.steps);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <Link href="/" className="text-sage-600 text-sm hover:underline">
          ← Назад
        </Link>
        {canDelete && <DeleteButton id={recipe.id} />}
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow border border-cream-200">
        <div className="relative h-64 sm:h-80 bg-cream-100">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs bg-sage-100 text-sage-700 px-2.5 py-1 rounded-full">
              {recipe.category}
            </span>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full">
              {recipe.difficulty}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-sage-900 mb-2">
            {recipe.title}
          </h1>
          <p className="text-sage-700 mb-4">{recipe.description}</p>

          <div className="flex gap-6 text-sm text-sage-700 mb-6 pb-4 border-b border-cream-200">
            <span>⏱️ {recipe.cookTime} мин</span>
            <span>🍽️ {recipe.servings} порций</span>
          </div>

          <h2 className="font-bold text-lg mb-3">Ингредиенты</h2>
          <ul className="grid sm:grid-cols-2 gap-1.5 mb-8">
            {ingredients.map((item, i) => (
              <li key={i} className="bg-cream-50 px-3 py-1.5 rounded-lg text-sm">
                • {item}
              </li>
            ))}
          </ul>

          <h2 className="font-bold text-lg mb-3">Приготовление</h2>
          <ol className="space-y-3">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-sage-600 text-white text-sm flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
