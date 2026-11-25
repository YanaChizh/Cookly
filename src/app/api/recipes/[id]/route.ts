import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!recipe) {
    return NextResponse.json({ error: "Не найден" }, { status: 404 });
  }
  return NextResponse.json({
    ...recipe,
    category: recipe.category.name,
    ingredients: JSON.parse(recipe.ingredients),
    steps: JSON.parse(recipe.steps),
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Нужно войти" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.recipe.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Не найден" }, { status: 404 });
    }
    if (existing.authorId && existing.authorId !== session.id) {
      return NextResponse.json({ error: "Нет прав" }, { status: 403 });
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

    let cat = await prisma.category.findUnique({ where: { name: category } });
    if (!cat) {
      cat = await prisma.category.create({ data: { name: category } });
    }

    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        title: String(title).trim(),
        description: String(description).trim(),
        imageUrl: imageUrl?.trim() || existing.imageUrl,
        cookTime: Number(cookTime) || 30,
        servings: Number(servings) || 2,
        difficulty: difficulty || "Легко",
        ingredients: JSON.stringify(ingredients),
        steps: JSON.stringify(steps),
        categoryId: cat.id,
      },
    });

    return NextResponse.json({ id: recipe.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Ошибка обновления" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Нужно войти" }, { status: 401 });
  }

  const { id } = await params;
  const recipe = await prisma.recipe.findUnique({ where: { id } });

  if (!recipe) {
    return NextResponse.json({ error: "Рецепт не найден" }, { status: 404 });
  }

  if (recipe.authorId && recipe.authorId !== session.id) {
    return NextResponse.json({ error: "Нет прав на удаление" }, { status: 403 });
  }

  await prisma.recipe.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
