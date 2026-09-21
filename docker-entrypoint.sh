#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Seeding reference data (skips automatically if already seeded)..."
npx prisma db seed

echo "Starting app..."
exec "$@"
