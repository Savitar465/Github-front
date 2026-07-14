# Dockerfile para GitHubX Frontend
# Multi-stage build para optimizar tamaño de imagen

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar todas las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar dependencias del stage anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de entorno para build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Las NEXT_PUBLIC_* se hornean en el bundle del cliente durante `npm run build`;
# deben llegar como build args (cambiarlas en runtime no tiene efecto en el navegador).
ARG NEXT_PUBLIC_FILES_API_URL
ARG NEXT_PUBLIC_USERS_API_URL
ARG NEXT_PUBLIC_REPOSITORY_API_URL
ARG NEXT_PUBLIC_PR_API_URL
ARG NEXT_PUBLIC_ORG_API_URL
ARG NEXT_PUBLIC_ISSUES_API_URL
ARG NEXT_PUBLIC_KEYCLOAK_URL
ARG NEXT_PUBLIC_KEYCLOAK_REALM
ARG NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
ARG NEXT_PUBLIC_USE_KEYCLOAK
ARG NEXT_PUBLIC_USE_MOCK_AUTH
ARG NEXT_PUBLIC_GIT_HTTP_URL
ARG NEXT_PUBLIC_GIT_SSH_HOST
ARG NEXT_PUBLIC_GIT_SSH_PORT
ARG NEXT_PUBLIC_CLASSIFIER_API_URL
ARG NEXT_PUBLIC_SUMMARIZER_API_URL
ENV NEXT_PUBLIC_FILES_API_URL=$NEXT_PUBLIC_FILES_API_URL \
    NEXT_PUBLIC_USERS_API_URL=$NEXT_PUBLIC_USERS_API_URL \
    NEXT_PUBLIC_REPOSITORY_API_URL=$NEXT_PUBLIC_REPOSITORY_API_URL \
    NEXT_PUBLIC_PR_API_URL=$NEXT_PUBLIC_PR_API_URL \
    NEXT_PUBLIC_ORG_API_URL=$NEXT_PUBLIC_ORG_API_URL \
    NEXT_PUBLIC_ISSUES_API_URL=$NEXT_PUBLIC_ISSUES_API_URL \
    NEXT_PUBLIC_KEYCLOAK_URL=$NEXT_PUBLIC_KEYCLOAK_URL \
    NEXT_PUBLIC_KEYCLOAK_REALM=$NEXT_PUBLIC_KEYCLOAK_REALM \
    NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=$NEXT_PUBLIC_KEYCLOAK_CLIENT_ID \
    NEXT_PUBLIC_USE_KEYCLOAK=$NEXT_PUBLIC_USE_KEYCLOAK \
    NEXT_PUBLIC_USE_MOCK_AUTH=$NEXT_PUBLIC_USE_MOCK_AUTH \
    NEXT_PUBLIC_GIT_HTTP_URL=$NEXT_PUBLIC_GIT_HTTP_URL \
    NEXT_PUBLIC_GIT_SSH_HOST=$NEXT_PUBLIC_GIT_SSH_HOST \
    NEXT_PUBLIC_GIT_SSH_PORT=$NEXT_PUBLIC_GIT_SSH_PORT
ENV NEXT_PUBLIC_CLASSIFIER_API_URL=$NEXT_PUBLIC_CLASSIFIER_API_URL
ENV NEXT_PUBLIC_SUMMARIZER_API_URL=$NEXT_PUBLIC_SUMMARIZER_API_URL

# Build de la aplicación
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Cambiar ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
