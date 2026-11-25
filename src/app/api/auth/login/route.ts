import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkPassword, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await checkPassword(password, user.password))) {
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
    }

    await createSession({ id: user.id, name: user.name, email: user.email });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
