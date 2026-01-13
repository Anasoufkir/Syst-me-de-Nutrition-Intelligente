# =============================================================================
# Système de Nutrition Intelligente — Dockerfile multi-stage
# =============================================================================

# --- Stage 1: Base ---
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# --- Stage 2: Development (hot-reload) ---
FROM base AS development
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# --- Stage 3: Builder ---
FROM base AS builder
RUN npm ci --only=production=false
COPY . .
RUN npm run build

# --- Stage 4: Production ---
FROM node:20-alpine AS production
WORKDIR /app

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist

# Changer le propriétaire des fichiers
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/v1/health || exit 1

CMD ["node", "dist/app.js"]
