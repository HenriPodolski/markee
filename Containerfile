# Stage 1: Install dependencies
FROM node:22-alpine AS dependencies

WORKDIR /app

# Copy package.json and lock file
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Stage 2: Build the frontend
FROM node:22-alpine AS frontend-builder

WORKDIR /frontend

# Copy dependencies from the previous stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy frontend-specific files
COPY src/ ./src
COPY public/ ./public
COPY vite.config.ts ./vite.config.ts
COPY tsconfig.json ./tsconfig.json
COPY postcss.config.js ./postcss.config.js
COPY tailwind.config.js ./tailwind.config.js
COPY package.json package-lock.json ./
COPY index.html ./
COPY tsconfig.app.json ./
COPY tsconfig.node.json ./

# Build the frontend
RUN npm run build

# Stage 3: Build the backend
FROM node:22-alpine AS backend-builder

WORKDIR /backend

# Copy dependencies from the previous stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy backend-specific files
COPY server/ ./server

# Stage 4: Create the production image
FROM node:22-alpine

WORKDIR /app

# Copy built backend and frontend from previous stages
COPY --from=backend-builder /backend ./
COPY --from=frontend-builder /frontend/dist ./dist

# Expose the port the app runs on
EXPOSE 3200

# Start the application
CMD ["node", "server/index.js"]
