# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS web-build
WORKDIR /web
COPY web/package.json web/package-lock.json* ./
RUN npm install --no-audit --no-fund
COPY web/ ./
RUN npm run build

FROM node:22-alpine AS api-build
WORKDIR /api
RUN apk add --no-cache python3 make g++
COPY api/package.json api/package-lock.json* ./
RUN npm install --no-audit --no-fund
COPY api/ ./
RUN npm run build && npm prune --omit=dev

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=8080 \
    STATIC_DIR=/app/web/dist \
    DB_PATH=/data/messageboard.db \
    IMAGE_DIR=/data/images
COPY --from=api-build /api/node_modules ./node_modules
COPY --from=api-build /api/dist ./dist
COPY --from=api-build /api/package.json ./package.json
COPY --from=web-build /web/dist ./web/dist
RUN mkdir -p /data && addgroup -S app && adduser -S -G app app && chown -R app:app /app /data
USER app
VOLUME ["/data"]
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s CMD wget -qO- http://127.0.0.1:8080/api/health || exit 1
LABEL org.opencontainers.image.title="messageboard" \
      org.opencontainers.image.source="https://github.com/jonwilliams84/messageboard"
CMD ["node", "dist/index.js"]
