# Base image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies only
FROM base AS dependencies
# Copy package.json files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/db/package.json ./packages/db/
COPY packages/shared-types/package.json ./packages/shared-types/
# Install all dependencies
RUN pnpm install --frozen-lockfile

# Build stage: compile TypeScript and generate Prisma client
FROM dependencies AS builder
# Copy all source files
COPY . .
# Generate Prisma client
RUN pnpm --filter @url-shortener/db generate
# Build shared types first
RUN pnpm --filter @url-shortener/shared-types build
# Build API
RUN pnpm --filter @url-shortener/api build

# Production stage: create final image with minimal dependencies
FROM base AS production
ENV NODE_ENV=production

# Copy necessary files from build stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/db/prisma ./packages/db/prisma
# Copy the generated Prisma client folder
COPY --from=builder /app/packages/db/generated ./packages/db/generated
# Copy package.json files
COPY --from=builder /app/packages/db/package.json ./packages/db/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/package.json ./

# Copy docker-entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose API port
EXPOSE 3333

# Start application
CMD ["/docker-entrypoint.sh"]