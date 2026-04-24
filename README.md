# TechShop + HoReCa Backend

Backend-проєкт для інтернет-магазину електроніки та системи бронювання HoReCa обладнання.

## 🚀 Технологічний стек
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT (Access + Refresh Tokens)
- **Documentation**: Swagger UI

## 🛠️ Швидкий старт

### 1. Встановлення залежностей
```bash
npm install
```

### 2. Налаштування середовища
Скопіюйте `.env.example` у `.env` та налаштуйте `DATABASE_URL`:
```bash
cp .env.example .env
```

### 3. Запуск бази даних (Docker)
```bash
docker-compose up -d
```

### 4. Налаштування бази даних
```bash
# Генерація Prisma Client
npm run db:generate

# Застосування схеми до БД
npm run db:push

# Заповнення бази тестовими даними
npm run db:seed
```

### 5. Запуск сервера
```bash
# Розробка
npm run dev

# Продакшн
npm start
```

## 📚 Документація API
Після запуску сервера документація доступна за адресою:
`http://localhost:3000/api-docs`

## 👥 Ролі та доступи
- **CLIENT**: Перегляд товарів, створення замовлень та бронювань (своїх).
- **HORECA_MANAGER**: Управління всіма бронюваннями HoReCa.
- **ADMIN**: Повний доступ до всіх ресурсів, управління користувачами та товарами.

## 🔑 Тестові акаунти (після сиду)
- **Admin**: `admin@techshop.com` / `password123`
- **Manager**: `manager@techshop.com` / `password123`
- **Client**: `client@techshop.com` / `password123`

## 📂 Структура проєкту
- `src/app.js` — Налаштування Express та Middleware.
- `src/controllers/` — Логіка обробки запитів.
- `src/services/` — Бізнес-логіка та робота з БД.
- `src/routes/` — Ендпоінти API.
- `src/validators/` — Валідація вхідних даних.
- `prisma/schema.prisma` — Схема бази даних.
