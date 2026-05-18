# Stage 1: Build the Vite React TypeScript application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests first for layer caching
COPY package*.json ./

# Install dependencies (no lockfile exists, use npm install)
RUN npm install

# Copy source code
COPY . .

# Build the application — outputs to dist/
RUN npm run build

# Stage 2: Serve static files with nginx
FROM nginx:alpine

# Copy built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for the web server
EXPOSE 80

# Run nginx in the foreground (required for Docker containers)
CMD ["nginx", "-g", "daemon off;"]
