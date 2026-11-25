import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Пароль минимум 8 символов" }, { status: 400 });
    }
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Некорректный email" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: "Такой email уже зарегистрирован" }, { status: 400 });
    }

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    await createSession({ id: user.id, name: user.name, email: user.email });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
