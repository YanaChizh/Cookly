import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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

  // Можно удалить свой рецепт или стартовый (без автора)
  if (recipe.authorId && recipe.authorId !== session.id) {
    return NextResponse.json({ error: "Нет прав на удаление" }, { status: 403 });
  }

  await prisma.recipe.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
