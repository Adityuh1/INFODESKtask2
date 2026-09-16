# =============================================================================
# Dockerfile — Tech-Debt Auditor Backend
# =============================================================================

# ── Base Image ────────────────────────────────────────────────────────────────
# node:20-slim = official Node.js 20, Debian-slim base (~80MB, no extras)
FROM node:20-slim

# ── Labels (metadata) ─────────────────────────────────────────────────────────
LABEL maintainer="Tech-Debt Auditor"
LABEL description="Automated Tech-Debt Auditor — Express API Backend"
LABEL version="1.0.0"

# ── Working Directory ─────────────────────────────────────────────────────────
# All commands from here on run inside /app inside the container
WORKDIR /app

# ── System Dependencies ───────────────────────────────────────────────────────
# git  → needed because the app clones repos at runtime (/api/audit endpoint)
# curl → needed for the HEALTHCHECK directive below
# --no-install-recommends keeps the install lean
RUN apt-get update && \
    apt-get install -y --no-install-recommends git curl && \
    rm -rf /var/lib/apt/lists/*

# ── Install Node Dependencies (Layer Cache Optimisation) ──────────────────────
# Copy ONLY package files first. Docker caches this layer separately.
# npm install only re-runs when package.json / package-lock.json change.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ── Copy Application Source ───────────────────────────────────────────────────
COPY server.js ./
COPY scanner/ ./scanner/

# ── Prepare Runtime Directory ─────────────────────────────────────────────────
# The app writes cloned repos to temp-audits/ — must be owned by `node` user
RUN mkdir -p temp-audits && chown -R node:node /app

# ── Non-Root User (Security) ──────────────────────────────────────────────────
# The official node image ships with a built-in `node` user (uid=1000).
# Running as root inside a container is a serious security risk.
USER node

# ── Expose Port ───────────────────────────────────────────────────────────────
EXPOSE 3001

# ── Health Check ──────────────────────────────────────────────────────────────
# Docker polls /api/health every 30s.
# After 3 failures → container status becomes "unhealthy"
# --start-period=15s gives the server time to boot before checks begin
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:3001/api/health || exit 1

# ── Start Command ─────────────────────────────────────────────────────────────
CMD ["node", "server.js"]