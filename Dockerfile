FROM node:24.2.0-alpine AS base

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

# Use an unprivileged workspace
WORKDIR /home/node
USER node

# Copy workspace manifests first to leverage Docker layer caching
COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=node:node packages/core/package.json ./packages/core/
COPY --chown=node:node apps/backend/package.json ./apps/backend/
COPY --chown=node:node apps/frontend/package.json ./apps/frontend/

# Install all dependencies once for every build target
RUN pnpm install --frozen-lockfile

# Copy the full source tree and shared config
FROM base AS source
COPY --chown=node:node packages ./packages
COPY --chown=node:node apps ./apps
COPY --chown=node:node tsconfig.base.json ./

# Build shared core package so other apps can depend on it
RUN pnpm run -C packages/core build

# --- Backend build stage -----------------------------------------------------
FROM source AS backend-builder
RUN pnpm run -C apps/backend build

# --- Frontend build stage ----------------------------------------------------
FROM source AS frontend-builder
RUN pnpm run -C apps/frontend build

# --- Backend runtime image ---------------------------------------------------
FROM node:24.2.0-alpine AS backend

RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

WORKDIR /home/node
USER node

COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=node:node packages/core/package.json ./packages/core/
COPY --chown=node:node apps/backend/package.json ./apps/backend/

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy the compiled artifacts
COPY --chown=node:node --from=backend-builder /home/node/apps/backend/dist ./apps/backend/dist
COPY --chown=node:node --from=backend-builder /home/node/packages/core/dist ./packages/core/dist

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "apps/backend/dist/index.js"]

# --- Frontend runtime image --------------------------------------------------
FROM nginx:1.27-alpine AS frontend

COPY --from=frontend-builder /home/node/apps/frontend/dist /usr/share/nginx/html

# Minimal nginx config with SPA routing + API proxy
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /api { \
        proxy_pass http://backend:3000; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

