# DanTrack

DanTrack - это fullstack-приложение для учета времени, проектов, задач и базовой отчетности.

## Что нужно для запуска

- `Node.js` и `npm`
- `Bun`
- `PostgreSQL`

## Структура проекта

- `main/frontend/app` - Angular frontend
- `main/backend` - Elysia + Prisma backend

## Подготовка базы данных

1. Убедись, что локально запущен `PostgreSQL`.
2. Создай базу данных `dan_track`, если она еще не создана.
3. Проверь файл [main/backend/.env](/Users/timurdanilov/Desktop/DanTrack/main/backend/.env).

Пример основных переменных:

```env
DATABASE_URL="postgres://timurdanilov@localhost:5432/dan_track?schema=public"
JWT_SECRET="your_secret"
```

## Установка зависимостей

Frontend:

```bash
cd /Users/timurdanilov/Desktop/DanTrack/main/frontend/app
npm install
```

Backend:

```bash
cd /Users/timurdanilov/Desktop/DanTrack/main/backend
bun install
```

## Prisma и миграции

После установки зависимостей выполни:

```bash
cd /Users/timurdanilov/Desktop/DanTrack/main/backend
bunx prisma migrate dev
bunx prisma generate
```

Если миграции уже существуют и нужно только применить их:

```bash
cd /Users/timurdanilov/Desktop/DanTrack/main/backend
bunx prisma migrate deploy
bunx prisma generate
```

## Запуск проекта

Запуск backend:

```bash
cd /Users/timurdanilov/Desktop/DanTrack/main/backend
bun run dev
```

Backend работает по адресу:

```text
http://localhost:51212
```

Запуск frontend:

```bash
cd /Users/timurdanilov/Desktop/DanTrack/main/frontend/app
npm start
```

Frontend по умолчанию открывается на:

```text
http://localhost:4200
```

## Что проверить после запуска

### 1. Auth

- Открой `/registration`
- Зарегистрируй нового пользователя
- Перейди на `/login`
- Выполни вход
- Проверь, что после входа доступны страницы внутри `/main/*`

Дополнительно:

- Попробуй открыть `/main/projects` без авторизации
- Должен сработать guard и перенаправить на страницу логина

### 2. Projects

Открой страницу `Projects` в sidebar и проверь:

- создание проекта
- отображение проекта в списке
- открытие выбранного проекта
- отображение участников проекта

### 3. Tasks

Открой страницу `Tasks` и проверь:

- выбор проекта
- создание новой задачи
- изменение `title`, `description`, `priority`
- изменение `status`
- назначение `assignee`
- установку `deadline`
- открытие деталей задачи
- удаление задачи

### 4. Time Entries

Открой страницу `Time Entries` и проверь:

- выбор проекта
- выбор задачи
- запуск таймера
- остановку таймера
- отображение текущей и прошлых записей времени

### 5. Reports

Открой страницу `Reports` и проверь:

- загрузку данных за период
- summary-блок
- отображение данных по проектам
- отображение данных по участникам
- daily-статистику

### 6. Profile

Открой страницу `Profile` и проверь:

- загрузку текущего пользователя
- отображение `name`
- отображение `email`
- отображение `role`
- отображение `image`
- открытие окна редактирования профиля
- обновление `name`
- обновление `email`
- загрузку нового изображения

## Полезные команды

Frontend форматирование:

```bash
cd /Users/timurdanilov/Desktop/DanTrack/main/frontend/app
npm run format
```

Backend форматирование:

```bash
cd /Users/timurdanilov/Desktop/DanTrack/main/backend
npm run format
```

## Короткий сценарий быстрой проверки

1. Зарегистрируй пользователя.
2. Выполни вход.
3. Создай проект.
4. Создай задачу внутри проекта.
5. Назначь статус, дедлайн и исполнителя.
6. Запусти таймер для задачи.
7. Останови таймер.
8. Проверь, что данные появились в `Reports`.
9. Открой `Profile` и обнови данные пользователя.

## Примечание

- Frontend использует backend по адресу `http://localhost:51212`.
- Если после изменения Prisma-моделей типы не обновились, заново выполни:

```bash
cd /Users/timurdanilov/Desktop/DanTrack/main/backend
bunx prisma generate
```
