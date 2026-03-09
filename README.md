# MyArticle

> web application built with **nuxt** (Frontend) + **Hono** (Backend API) + **Redis** (Messaging)

## Notes 

```
i recomended start backend first before frontend
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Nuxt 3  |
| Styling | Tailwind CSS |
| Backend | Hono (REST API) |
| Database | PostgreSQL |

---

## 📁 Project Structure

```
├── front/        # vite App
└── backend/         # Laravel API
```

---

## ⚙️ Prerequisites

Make sure you have these installed:

- **Node.js** v18+ & **npm** / **bun**
- **PostgreSQL**
- **Redis**

---

## 🖥️ Frontend — Nuxt

### Setup

```bash
cd front
npm install
# or
bun install
```

### Environment

```bash
cp .env.example .env
```

### Run Development Server

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## 🔧 Backend — Hono

### Setup

```bash
cd backend
npm install
# or
bun install
```

### Environment

```bash
  cp .env.example .env
```

```env

```

### Database Migration

```bash
bunx / npmx prisma migrate dev
```

### Run Development Server

```bash
bun run dev 
or
npm run dev
```

API will be available at [http://localhost:3000](http://localhost:3000)

---

## 🔗 API Endpoints

Base URL: `http://localhost:3000`

---

## 🤝 Contributing

1. Fork this repository
2. Create your feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

---

## 📄 License
---

<div align="center">
  Made with ❤️ by <a href="https://github.com/fawwazalmumtaz">Muhammad Fawwaz Almumtaz</a>
</div>
