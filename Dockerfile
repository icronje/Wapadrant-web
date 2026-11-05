# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base

# Install PostgreSQL 16 and other dependencies in the SAME container
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gnupg \
    openssl \
    ca-certificates \
    && curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /usr/share/keyrings/postgresql.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/postgresql.gpg] http://apt.postgresql.org/pub/repos/apt bookworm-pgdg main 16" > /etc/apt/sources.list.d/pgdg.list \
    && apt-get update && apt-get install -y --no-install-recommends \
    postgresql-16 \
    postgresql-client-16 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Initialize PostgreSQL data directory
RUN mkdir -p /var/lib/postgresql/data \
    && chown -R postgres:postgres /var/lib/postgresql \
    && su - postgres -c "/usr/lib/postgresql/16/bin/initdb -D /var/lib/postgresql/data --auth=trust"

WORKDIR /app

# ---------------------------------------------------------------------------
# Dependencies stage
# ---------------------------------------------------------------------------
FROM base AS deps

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ---------------------------------------------------------------------------
# Builder stage
# ---------------------------------------------------------------------------
FROM base AS builder

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npx prisma generate
RUN npm run build

# ---------------------------------------------------------------------------
# Production stage — includes PostgreSQL in the same container
# ---------------------------------------------------------------------------
FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3100
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL=postgresql://wapadrant:wapadrant@localhost:5432/wapadrant?schema=public

WORKDIR /app

# Copy built Next.js app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json* ./package-lock.json*
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/next.config* ./

# Entrypoint script — starts PostgreSQL, runs migrations, then starts app
COPY --chmod=755 docker-entrypoint.sh ./docker-entrypoint.sh

EXPOSE 3100

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["npx", "next", "start", "-p", "3100"]
