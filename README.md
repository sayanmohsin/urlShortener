# Turborepo Boilerplate

A modern full-stack monorepo with **Next.js**, **NestJS**, and **Prisma**.

## 🚀 Features

- **TypeScript** – End-to-end type safety  
- **Turborepo** – Efficient build system with caching  
- **Next.js** – Powerful frontend framework  
- **NestJS** – Scalable backend with structured logging  
- **Prisma ORM** – Type-safe database toolkit in a shared package  
- **Zod** – Runtime schema validation  
- **Biome** – Lightning-fast linting and formatting  

## 🗂️ Project Structure

```
.
├── apps/
│   ├── api/                # NestJS backend
│   └── web/                # Next.js frontend
├── packages/
│   └── db/                 # Prisma schema & client
├── turbo.json              # Turborepo configuration
└── pnpm-workspace.yaml     # Monorepo workspace configuration
```

## ⚙️ Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Generate Prisma client
pnpm db:generate

# Start development servers
pnpm dev
```

## 📜 Scripts

| Command             | Description                        |
|---------------------|------------------------------------|
| `pnpm dev`          | Start all apps in development mode |
| `pnpm build`        | Build all apps                     |
| `pnpm db:generate`  | Generate Prisma client             |
| `pnpm lint`         | Lint the entire codebase           |
| `pnpm format`       | Format code using Biome            |
