"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIES = ["Завтраки", "Основные блюда", "Супы", "Салаты", "Десерты", "Напитки"];

export default function NewRecipePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authChecked, setAuthChecked] = useState(false);

  // Проверка входа
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) router.push("/login?from=/recipes/new");
        else setAuthChecked(true);
      });
  }, [router]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Основные блюда");
  const [imageUrl, setImageUrl] = useState("");
  const [cookTime, setCookTime] = useState(30);
  const [servings, setServings] = useState(2);
  const [difficulty, setDifficulty] = useState("Легко");
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleanIng = ingredients.map((i) => i.trim()).filter(Boolean);
    const cleanSteps = steps.map((s) => s.trim()).filter(Boolean);

    if (!cleanIng.length || !cleanSteps.length) {
      setError("Добавьте ингредиенты и шаги");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          imageUrl,
          cookTime,
          servings,
          difficulty,
          ingredients: cleanIng,
          steps: cleanSteps,
        }),
      });

      const text = await res.text();
      let data: { id?: string; error?: string } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        setError("Сервер вернул неверный ответ. Перезапустите проект.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(data.error || "Ошибка сохранения");
        setLoading(false);
        return;
      }

      if (!data.id) {
        setError("Рецепт не сохранился");
        setLoading(false);
        return;
      }

      router.push(`/recipes/${data.id}`);
    } catch {
      setError("Ошибка сети. Проверьте, что сервер запущен.");
      setLoading(false);
    }
  }

  if (!authChecked) return <p className="text-center py-20 text-sage-600">Проверка входа...</p>;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link href="/" className="text-sage-600 text-sm hover:underline">← Назад</Link>
      <h1 className="text-2xl font-bold mt-4 mb-6">Добавить рецепт</h1>

      <form onSubmit={submit} className="bg-white rounded-2xl p-6 shadow border border-cream-200 space-y-4">
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium mb-1">Название *</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-sage-200 rounded-xl px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Категория</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-sage-200 rounded-xl px-3 py-2">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Описание *</label>
          <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-sage-200 rounded-xl px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ссылка на фото</label>
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://... или оставьте пустым"
            className="w-full border border-sage-200 rounded-xl px-3 py-2" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Минут</label>
            <input type="number" min={1} value={cookTime} onChange={(e) => setCookTime(+e.target.value)}
              className="w-full border border-sage-200 rounded-xl px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Порций</label>
            <input type="number" min={1} value={servings} onChange={(e) => setServings(+e.target.value)}
              className="w-full border border-sage-200 rounded-xl px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Сложность</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
              className="w-full border border-sage-200 rounded-xl px-3 py-2">
              <option>Легко</option>
              <option>Средне</option>
              <option>Сложно</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ингредиенты *</label>
          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={ing} onChange={(e) => {
                const arr = [...ingredients]; arr[i] = e.target.value; setIngredients(arr);
              }} className="flex-1 border border-sage-200 rounded-xl px-3 py-2" placeholder={`Ингредиент ${i + 1}`} />
              {ingredients.length > 1 && (
                <button type="button" onClick={() => setIngredients(ingredients.filter((_, j) => j !== i))}
                  className="text-red-500 px-2">✕</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => setIngredients([...ingredients, ""])}
            className="text-sm text-sage-600">+ ещё</button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Шаги *</label>
          {steps.map((step, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <span className="pt-2 text-sage-500 w-5">{i + 1}.</span>
              <textarea value={step} onChange={(e) => {
                const arr = [...steps]; arr[i] = e.target.value; setSteps(arr);
              }} rows={2} className="flex-1 border border-sage-200 rounded-xl px-3 py-2" />
              {steps.length > 1 && (
                <button type="button" onClick={() => setSteps(steps.filter((_, j) => j !== i))}
                  className="text-red-500 px-2 self-start">✕</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => setSteps([...steps, ""])}
            className="text-sm text-sage-600">+ ещё шаг</button>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-2.5 bg-sage-600 text-white rounded-xl font-medium hover:bg-sage-700 disabled:opacity-50">
          {loading ? "Сохранение..." : "Добавить рецепт"}
        </button>
      </form>
    </div>
  );
}
