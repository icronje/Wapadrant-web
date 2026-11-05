#!/bin/sh
set -e

# Start PostgreSQL
echo "Starting PostgreSQL..."
su - postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/lib/postgresql/data -l /tmp/pg.log start -w" 2>/dev/null || true

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
for i in $(seq 1 30); do
  if su - postgres -c "pg_isready" 2>/dev/null; then
    echo "PostgreSQL is ready."
    break
  fi
  echo "  ...waiting ($i/30)"
  sleep 1
done

# Create database and user if they don't exist
echo "Setting up database and user..."
su - postgres -c "psql -c \"SELECT 1 FROM pg_database WHERE datname='wapadrant'\"" | grep -q 1 || \
  su - postgres -c "createdb wapadrant"
su - postgres -c "psql -c \"SELECT 1 FROM pg_roles WHERE rolname='wapadrant'\"" | grep -q 1 || \
  su - postgres -c "psql -c \"CREATE USER wapadrant WITH PASSWORD 'wapadrant123' SUPERUSER\""
su - postgres -c "psql -c \"ALTER USER wapadrant WITH PASSWORD 'wapadrant123'\"" 2>/dev/null || true
su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE wapadrant TO wapadrant\"" 2>/dev/null || true

# Run Prisma migrations
echo "Running prisma db push..."
npx prisma db push --accept-data-loss 2>&1 || echo "⚠️ prisma db push failed, continuing..."

# Start the Next.js app
echo "Starting Next.js app..."
exec "$@"
