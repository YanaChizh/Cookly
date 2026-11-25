import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category");
    const recipes = await prisma.recipe.findMany({
      where: category && category !== "Все" ? { category } : undefined,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(
      recipes.map((r) => ({
        ...r,
        ingredients: JSON.parse(r.ingredients),
        steps: JSON.parse(r.steps),
      }))
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Ошибка загрузки рецептов" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Нужно войти" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      category,
      imageUrl,
      cookTime,
      servings,
      difficulty,
      ingredients,
      steps,
    } = body;

    if (!title || !description || !category || !ingredients?.length || !steps?.length) {
      return NextResponse.json(
        { error: "Заполните все обязательные поля" },
        { status: 400 }
      );
    }

    const recipe = await prisma.recipe.create({
      data: {
        title: String(title).trim(),
        description: String(description).trim(),
        category: String(category),
        imageUrl: imageUrl?.trim() || "/images/placeholder.jpg",
        cookTime: Number(cookTime) || 30,
        servings: Number(servings) || 2,
        difficulty: difficulty || "Легко",
        ingredients: JSON.stringify(ingredients),
        steps: JSON.stringify(steps),
        authorId: session.id,
      },
    });

    return NextResponse.json({ id: recipe.id });
  } catch (e) {
    console.error("Create recipe error:", e);
    return NextResponse.json(
      { error: "Ошибка при сохранении рецепта. Проверьте базу данных." },
      { status: 500 }
    );
  }
}
