# MyArticle

> A modern blog platform built with **Nuxt 3** (Frontend) and **Hono** (Backend API).  
> Uses **PostgreSQL** as the main database and **Redis** for caching and view counters.

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|-------------|
| Frontend | Nuxt 3 |
| Styling | Tailwind CSS |
| Backend | Hono (REST API) |
| Database | PostgreSQL |
| Cache | Redis |
| Runtime | Bun / Node.js |

---

## ✨ Features

- Article management (CRUD)
- Category management
- Redis-based view counter
- Image upload support
- Rate limiting
- CSRF protection
- Structured logging
- RESTful API design

---

## 📁 Project Structure

```
.
├── front/        # Nuxt 3 frontend application
├── backend/      # Hono REST API server
└── README.md
```

---

## ⚙️ Prerequisites

Make sure you have these installed:

- **Node.js** v18+
- **npm** or **bun**
- **PostgreSQL**
- **Redis**

---

# 🖥️ Frontend — Nuxt

## Setup

```bash
cd front
npm install
# or
bun install
```

## Environment Setup

```bash
cp .env.example .env
```

Example `.env`

```env
NUXT_PUBLIC_API_URL=http://localhost:3000
```

## Run Development Server

```bash
npm run dev
# or
bun run dev
```

Open in browser:

```
http://localhost:3001
```

## Build for Production

```bash
npm run build
npm run start
```

---

# 🔧 Backend — Hono

## Setup

```bash
cd backend
npm install
# or
bun install
```

## Environment Setup

```bash
cp .env.example .env
```

Example `.env`

```env
DATABASE_URL="postgresql://postgres:root@localhost:5432/myarticle"
DATABASE_POST=5432
DATABASE_PASSWORD="root"
DATABASE_USER="postgres"
DATABASE_NAME="myarticle"
NODE_ENV="development"
APP_NAME="article"
REDIS_PORT=6379
REDIS_DB=0
REDIS_HOST='127.0.0.1'
REDIS_PASSWORD=
FRONT_END_URL="https://localhost:3000"
```

---

## Database Migration

```bash
# using bun
bunx prisma migrate dev

# using npm
npx prisma migrate dev
```

---

## Run Development Server

```bash
bun run dev
# or
npm run dev
```

API will be available at:

```
http://localhost:3000
```

---

## 🔗 API Endpoints

Base URL:

```
http://localhost:3000
```

| Method | Endpoint | Description |
|------|---------|-------------|
| GET | /article | Get articles |
| GET | /article/:id | Get single article |
| POST | /article | Create article |
| PUT | /article/:id | Update article |
| DELETE | /article/:id | Delete article |
| GET | /category | Get categories |

---

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch

```bash
git checkout -b feat/your-feature
```

3. Commit your changes

```bash
git commit -m "feat: add your feature"
```

4. Push to the branch

```bash
git push origin feat/your-feature
```

5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

Made with ❤️ by  
**Muhammad Fawwaz Almumtaz**

</div>
