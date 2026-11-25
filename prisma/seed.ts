import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const categoryNames = [
  "Завтраки",
  "Основные блюда",
  "Супы",
  "Салаты",
  "Десерты",
  "Напитки",
];

const recipesData = [
  {
    title: "Пышные блины с мёдом",
    description: "Классические воздушные блины. Идеальный завтрак.",
    categoryName: "Завтраки",
    imageUrl: "/images/pancakes.jpg",
    cookTime: 30,
    servings: 4,
    difficulty: "Легко",
    ingredients: JSON.stringify(["2 стакана муки", "2 яйца", "2 стакана молока", "2 ст.л. сахара", "1/2 ч.л. соли", "2 ст.л. масла", "1 ч.л. разрыхлителя", "Мёд"]),
    steps: JSON.stringify(["Взбейте яйца с сахаром и солью.", "Добавьте молоко.", "Всыпьте муку с разрыхлителем.", "Добавьте масло, дайте постоять 10 мин.", "Жарьте на сковороде с двух сторон.", "Подавайте с мёдом."]),
  },
  {
    title: "Сырники",
    description: "Нежные творожные сырники с хрустящей корочкой.",
    categoryName: "Завтраки",
    imageUrl: "/images/syrniki.jpg",
    cookTime: 25,
    servings: 3,
    difficulty: "Легко",
    ingredients: JSON.stringify(["400 г творога", "1 яйцо", "3-4 ст.л. муки", "2 ст.л. сахара", "Щепотка соли", "Масло для жарки"]),
    steps: JSON.stringify(["Разомните творог.", "Добавьте яйцо, сахар, соль.", "Всыпьте муку, замесите.", "Сформируйте лепёшки.", "Обжарьте с двух сторон.", "Подавайте со сметаной."]),
  },
  {
    title: "Паста с томатным соусом",
    description: "Простая паста в ароматном томатном соусе.",
    categoryName: "Основные блюда",
    imageUrl: "/images/pasta.jpg",
    cookTime: 25,
    servings: 2,
    difficulty: "Легко",
    ingredients: JSON.stringify(["250 г пасты", "400 г помидоров", "2 зубчика чеснока", "1 луковица", "2 ст.л. масла", "Соль, перец, базилик"]),
    steps: JSON.stringify(["Отварите пасту.", "Обжарьте лук и чеснок.", "Добавьте помидоры, тушите 10 мин.", "Смешайте с пастой.", "Подавайте с сыром."]),
  },
  {
    title: "Овощной крем-суп",
    description: "Нежный суп-пюре из овощей.",
    categoryName: "Супы",
    imageUrl: "/images/soup.jpg",
    cookTime: 40,
    servings: 4,
    difficulty: "Средне",
    ingredients: JSON.stringify(["2 картофелины", "1 морковь", "1 луковица", "1 кабачок", "1 л бульона", "Масло, соль, перец"]),
    steps: JSON.stringify(["Нарежьте овощи.", "Обжарьте лук.", "Добавьте овощи и бульон.", "Варите 25 минут.", "Измельчите блендером.", "Посолите и подавайте."]),
  },
  {
    title: "Ягодный десерт",
    description: "Лёгкий десерт с творожным кремом и ягодами.",
    categoryName: "Десерты",
    imageUrl: "/images/berry-dessert.jpg",
    cookTime: 20,
    servings: 4,
    difficulty: "Легко",
    ingredients: JSON.stringify(["300 г творога", "150 мл сливок", "3 ст.л. пудры", "400 г ягод", "Мята"]),
    steps: JSON.stringify(["Протрите творог.", "Взбейте сливки с пудрой.", "Смешайте с творогом.", "Выложите слоями с ягодами.", "Украсьте мятой."]),
  },
  {
    title: "Овощной салат",
    description: "Свежий хрустящий салат.",
    categoryName: "Салаты",
    imageUrl: "/images/salad.jpg",
    cookTime: 15,
    servings: 3,
    difficulty: "Легко",
    ingredients: JSON.stringify(["2 огурца", "3 помидора", "1 перец", "1/2 лука", "Зелень", "2 ст.л. масла", "Лимонный сок, соль"]),
    steps: JSON.stringify(["Нарежьте овощи.", "Добавьте зелень.", "Заправьте маслом и соком.", "Посолите и перемешайте."]),
  },
  {
    title: "Домашний лимонад",
    description: "Освежающий лимонад с мятой и лимоном. Идеально в жару.",
    categoryName: "Напитки",
    imageUrl: "/images/lemonade.jpg",
    cookTime: 10,
    servings: 4,
    difficulty: "Легко",
    ingredients: JSON.stringify(["3 лимона", "1 л холодной воды", "4–5 ст.л. сахара", "Мята", "Лёд"]),
    steps: JSON.stringify(["Выжмите сок из лимонов.", "Разведите сахар в небольшом количестве тёплой воды.", "Смешайте сок, сахарный сироп и холодную воду.", "Добавьте мяту и лёд.", "Подавайте охлаждённым."]),
  },
  {
    title: "Ягодный смузи",
    description: "Густой смузи из ягод и банана. Быстрый и полезный напиток.",
    categoryName: "Напитки",
    imageUrl: "/images/smoothie.jpg",
    cookTime: 5,
    servings: 2,
    difficulty: "Легко",
    ingredients: JSON.stringify(["1 банан", "150 г ягод (клубника или малина)", "150 мл молока или йогурта", "1 ч.л. мёда", "Лёд по желанию"]),
    steps: JSON.stringify(["Положите все ингредиенты в блендер.", "Взбейте до однородной массы.", "При необходимости добавьте немного молока.", "Разлейте по стаканам и сразу подавайте."]),
  },
];

async function main() {
  const recipeCount = await prisma.recipe.count();
  if (recipeCount > 0) {
    console.log("Рецепты уже есть, пропускаем.");
    return;
  }

  for (const name of categoryNames) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("Категории созданы.");

  const categories = await prisma.category.findMany();
  const byName = Object.fromEntries(categories.map((c) => [c.name, c.id]));

  for (const r of recipesData) {
    await prisma.recipe.create({
      data: {
        title: r.title,
        description: r.description,
        imageUrl: r.imageUrl,
        cookTime: r.cookTime,
        servings: r.servings,
        difficulty: r.difficulty,
        ingredients: r.ingredients,
        steps: r.steps,
        categoryId: byName[r.categoryName],
      },
    });
  }
  console.log("Добавлено 8 рецептов.");
}

main().finally(() => prisma.$disconnect());
