#!/bin/sh
set -e

# Start PostgreSQL
echo "Starting PostgreSQL..."
pg_ctlcluster 16 main start 2>/dev/null || service postgresql start 2>/dev/null || su - postgres -c "pg_ctl -D /var/lib/postgresql/data start" 2>/dev/null || true

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
for i in $(seq 1 30); do
  if su - postgres -c "pg_isready" 2>/dev/null || pg_isready 2>/dev/null; then
    echo "PostgreSQL is ready."
    break
  fi
  echo "  ...waiting ($i/30)"
  sleep 1
done

# Run Prisma migrations
echo "Running prisma db push..."
npx prisma db push --accept-data-loss 2>&1 || echo "⚠️ prisma db push failed, continuing..."

# Start the Next.js app
echo "Starting Next.js app..."
exec "$@"
