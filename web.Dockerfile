# Base image for building
FROM node:22-alpine AS base

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Dependencies stage
FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared-types/package.json ./packages/shared-types/
RUN pnpm install --frozen-lockfile

# Build stage
FROM dependencies AS builder
COPY . .
RUN pnpm --filter @url-shortener/shared-types build
RUN pnpm --filter @url-shortener/web build

# Production stage with Nginx
FROM nginx:alpine AS production

# Copy built files
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Copy Nginx config
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Create a simple script to inject the API_URL at runtime
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo '# Create a simple JS file with the API_URL' >> /docker-entrypoint.sh && \
    echo 'echo "window.API_URL = \"$API_URL\";" > /usr/share/nginx/html/config.js' >> /docker-entrypoint.sh && \
    echo '' >> /docker-entrypoint.sh && \
    echo '# Start nginx' >> /docker-entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

EXPOSE 80

CMD ["/docker-entrypoint.sh"]