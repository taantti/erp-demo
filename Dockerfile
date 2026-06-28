# Production image for the ERP backend (Express + Mongoose).
FROM node:20-slim

WORKDIR /app

# Install ONLY production dependencies first, in their own layer.
# package*.json changes rarely, so this layer is cached across builds.
# Note: bcrypt is a native module; node:20-slim (glibc) uses its prebuilt
# binaries, so no compiler toolchain is needed (unlike alpine/musl).
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the application source (only what the server needs at runtime).
COPY src ./src

# The server binds to config.PORT (from the environment). Give the image a
# sane default so the container works even if PORT is not passed at runtime.
ENV NODE_ENV=production
ENV PORT=8000
EXPOSE 8000

# Runtime secrets/config (DATABASE_URI, JWT_SECRET_KEY, ...) are provided at
# `docker run -e ...`, NEVER baked into the image.
CMD ["node", "src/server.js"]
