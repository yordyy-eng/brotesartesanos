# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Placeholder values so payload.config.ts (imported at build time) has non-empty
# strings to work with — no DB connection happens during build since every
# page is force-dynamic (see src/app/[locale]/*/page.tsx). Real values are
# injected at container runtime via docker-compose `environment:`.
ENV PAYLOAD_SECRET=build-placeholder
ENV DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# ~150 unique photos per hero mosaic all get requested at once on page load,
# each triggering a live sharp resize. Raising UV_THREADPOOL_SIZE alone did
# NOT help (measured, see docs/DEPLOY.md) because sharp/libvips defaults to
# using ALL CPU cores for EACH individual resize — with many concurrent
# resizes on a 4-core box, they thrash fighting over the same cores instead
# of running in parallel. Capping each resize to a single core lets many
# resizes actually overlap instead of contending; UV_THREADPOOL_SIZE=16 gives
# enough queue slots for that overlap to happen.
ENV UV_THREADPOOL_SIZE=16
ENV VIPS_CONCURRENCY=1

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
