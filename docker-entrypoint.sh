#!/bin/sh
set -e

echo "Running database migrations..."
cd /app/packages/db && pnpm deploy

echo "Starting application..."
cd /app && node apps/api/dist/main.js