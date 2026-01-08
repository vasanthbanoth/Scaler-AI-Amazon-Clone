# Builder stage
FROM oven/bun:latest AS builder

WORKDIR /app

# Copy lock and package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code and build
COPY . .
RUN bun run build

# Runtime stage
FROM oven/bun:latest

WORKDIR /app

# Copy built assets and necessary files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Expose frontend port
EXPOSE 3000

# Start the application using Bun
CMD ["bun", "run", "start"]
