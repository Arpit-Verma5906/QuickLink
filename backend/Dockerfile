# Use the official Bun image as the base
# Stage 1 — Build
FROM oven/bun:1.2.15 AS build

# Set the working directory
WORKDIR /app

# Copy only necessary files first for layer caching
COPY bun.lock package.json ./
RUN bun install

# Copy rest of the app
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Stage 2 — Run (smaller image)
FROM oven/bun:1.2.15-slim

WORKDIR /app

# Copy only what’s needed from build stage
COPY --from=build /app /app

# Expose port
EXPOSE 3000

# Command to run the application using Bun
CMD [ "bun", "run", "server.ts" ]