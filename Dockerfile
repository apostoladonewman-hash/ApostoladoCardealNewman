# ==================================
# BACKEND DOCKERFILE
# Multi-stage build for Strapi
# ==================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Build Strapi admin panel
RUN npm run build

# ==================================
# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/config ./config
COPY --from=builder /app/database ./database
COPY --from=builder /app/src ./src
COPY --from=builder /app/scripts ./scripts

# Create directories for uploads and logs
RUN mkdir -p /app/public/uploads /app/logs

# Set environment variables
ENV NODE_ENV=production

# Expose port
EXPOSE 1337

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:1337/api/health/live', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["npm", "start"]
