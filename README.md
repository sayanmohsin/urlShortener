# 🔗 URL Shortener – Full Stack Monorepo

A modern, lightweight **URL shortener** built with **React**, **NestJS**, **PostgreSQL**, and **Prisma** in a powerful monorepo architecture using **Turborepo**.

---

## 🚀 Features

- ⚡ **Full Stack TypeScript** – End-to-end static typing  
- 📦 **Turborepo** – Blazing fast monorepo tooling with caching  
- 🧠 **React (Next.js)** – Clean, fast frontend with Tailwind CSS  
- 🛠️ **NestJS** – Scalable, modular backend architecture  
- 🧬 **Prisma ORM** – Type-safe database access layer (shared package)  
- 🛡 **Zod** – End-to-end schema validation  
- 🧹 **Biome** – Unified code formatter and linter  
- 🐳 **Docker + Docker Compose** – Easy local development and deployment

---

## 🗂️ Project Structure

```
.
├── apps/
│   ├── api/                # NestJS backend
│   └── web/                # React frontend
├── packages/
│   └── db/                 # Prisma schema & client
├── docker/
│   ├── dev/                # Docker Compose for local development
│   └── prod/               # Dockerfiles for production deployment
├── turbo.json              # Turborepo configuration
└── pnpm-workspace.yaml     # Monorepo workspace configuration
```

---

## ⚙️ Getting Started (Local Dev)

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env

# Generate Prisma client
pnpm db:generate

# Start the development servers
pnpm dev
```

---

## 🐳 Docker Usage

### Development

To run everything in a Dockerized local environment:

```bash
docker-compose -f docker/dev/docker-compose.yml up --build
```

### Production

Build and run production containers:

```bash
docker-compose -f docker/prod/docker-compose.yml up --build -d
```

---

## 📜 Scripts

| Command             | Description                        |
|---------------------|------------------------------------|
| `pnpm dev`          | Start all apps in development mode |
| `pnpm build`        | Build all apps                     |
| `pnpm db:generate`  | Generate Prisma client             |
| `pnpm db:migrate`   | Run Prisma migrations              |
| `pnpm lint`         | Lint the entire codebase           |
| `pnpm format`       | Format code using Biome            |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS  
- **Backend:** NestJS, Zod  
- **Database:** PostgreSQL  
- **ORM:** Prisma  
- **Monorepo Tooling:** Turborepo, PNPM  
- **Containerization:** Docker  
- **Tooling:** Biome for linting/formatting

---
