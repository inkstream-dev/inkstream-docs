# ──────────────────────────────────────────────
# Stage 1: Install dependencies
# ──────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ──────────────────────────────────────────────
# Stage 2: Build the Next.js application
# ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Tell Next.js to produce a standalone output bundle
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ──────────────────────────────────────────────
# Stage 3: Production runtime (minimal image)
# ──────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copy only the files needed to run the app
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
