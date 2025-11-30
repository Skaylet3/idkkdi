# Multi-stage Dockerfile for NestJS backend deployment
# Optimized for Render.com deployment

FROM node:20-alpine AS base
WORKDIR /app

# Install system dependencies for Prisma and runtime
# libc6-compat: Required for Node.js native modules
# openssl: Required for Prisma runtime
RUN apk add --no-cache libc6-compat openssl \
  && corepack enable

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# ======================================
# Dependencies Stage
# ======================================
FROM base AS deps

# Copy package files and Prisma schema
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# Install all dependencies (production + dev)
# Dev dependencies needed for build process
RUN pnpm install --frozen-lockfile

# ======================================
# Build Stage
# ======================================
FROM deps AS build

# Copy source code
COPY . .

# Setting db url
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Generate Prisma client and build application
RUN pnpm prisma generate \
  && pnpm run build

# Remove dev dependencies after build
RUN CI=true pnpm prune --prod

# ======================================
# Production Stage
# ======================================
FROM base AS prod

# Install pnpm globally for runtime (Render needs this)
RUN npm install -g pnpm

# Set production environment
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nestjs -u 1001

# Copy built application and dependencies
COPY --from=build --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/package.json ./package.json
COPY --from=build --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=build --chown=nestjs:nodejs /app/generated ./generated

# Switch to non-root user
USER nestjs

# Expose application port
EXPOSE 3000

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/auth/me', (r) => {process.exit(r.statusCode === 401 ? 0 : 1)})"

# Start application
# 1. Run migrations (ensures database is up-to-date)
# 2. Start NestJS server
CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/main"]