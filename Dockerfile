# syntax=docker/dockerfile:1
# Production image of the WebSpeed storefront + admin (Next.js standalone).
#   docker build -t webspeed-web .
#   docker run -p 3000:3000 -e API_INTERNAL_URL=http://api:8000/api/v1 -e SITE_URL=https://shop.example.com webspeed-web
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Rewrites (/api/v1 → Django) are compiled into the build: pass the API URL here
ARG API_INTERNAL_URL=http://api:8000/api/v1
ARG MEDIA_PUBLIC_URLS=
ENV API_INTERNAL_URL=$API_INTERNAL_URL MEDIA_PUBLIC_URLS=$MEDIA_PUBLIC_URLS NEXT_OUTPUT=standalone NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://127.0.0.1:3000/robots.txt >/dev/null || exit 1
CMD ["node", "server.js"]
