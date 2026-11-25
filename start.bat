@echo off
chcp 65001 >nul
title Cookly
cd /d "%~dp0"

echo.
echo   COOKLY - учебный проект
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  Node.js не найден!
    echo  Скачайте с https://nodejs.org/  (версия LTS)
    echo  После установки перезапустите этот файл.
    pause
    exit /b 1
)

echo  Node.js: 
node -v
echo.

if not exist ".env" (
    echo DATABASE_URL="file:./prisma/dev.db"> .env
    echo JWT_SECRET="cookly-secret-key-2024">> .env
)

if not exist "node_modules" (
    echo  Установка зависимостей (первый раз)...
    call npm install
    if %errorlevel% neq 0 (
        echo  Ошибка npm install
        pause
        exit /b 1
    )
)

echo  Подготовка базы...
call npx prisma generate
call npx prisma db push --skip-generate
call npx tsx prisma/seed.ts

echo.
echo  Сайт будет доступен по адресу:
echo  http://localhost:3000
echo.
echo  Откройте эту ссылку в браузере сами.
echo  Чтобы остановить сервер — нажмите Ctrl+C
echo.

call npm run dev
pause
