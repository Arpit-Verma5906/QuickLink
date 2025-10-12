# Stage 1: Build
FROM oven/bun:1.2.15 AS build

WORKDIR /app

# Install dependencies
COPY bun.lock package.json ./
RUN bun install

# Copy source and build
COPY . .
RUN bun run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy build files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy env template
COPY public/env.js /usr/share/nginx/html/env.js

# Replace env at container start
CMD ["sh", "-c", "sed -i 's|%%VITE_API_URL%%|${VITE_API_URL:-http://localhost:3000}|g' /usr/share/nginx/html/env.js && nginx -g 'daemon off;'"]

EXPOSE 80
