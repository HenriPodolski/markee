# Stage 1: Install root dependencies
FROM node:24-alpine AS root-dependencies

WORKDIR /app

# Copy package.json and lock file
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Stage 2: Install server (backend) dependencies
FROM node:24-alpine AS server-dependencies

WORKDIR /server

# Copy server package.json and lock file
COPY server/package.json server/package-lock.json ./

# Install server dependencies
RUN npm ci --legacy-peer-deps --only=production

# Stage 3: Build the frontend
FROM node:24-alpine AS frontend-builder

WORKDIR /frontend

# Copy dependencies from the root dependencies stage
COPY --from=root-dependencies /app/node_modules ./node_modules

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

# Stage 4: Build the backend
FROM node:24-alpine AS backend-builder

WORKDIR /backend

# Copy server dependencies from the server dependencies stage
COPY --from=server-dependencies /server/node_modules ./node_modules

# Copy backend-specific files
COPY server/ ./server

# Stage 5: Create the production image
FROM node:24-alpine

WORKDIR /app

# Copy built backend and frontend from previous stages
COPY --from=backend-builder /backend/server ./server
COPY --from=backend-builder /backend/node_modules ./server/node_modules
COPY --from=frontend-builder /frontend/dist ./dist

# Expose the port the app runs on
EXPOSE 3200

# Start the application
CMD ["node", "server/index.js"]
