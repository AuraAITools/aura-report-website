# Build dependencies stage
FROM node:20.15-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache g++ make py3-pip libc6-compat
RUN npm ci

# Builder stage
FROM node:20.15-alpine AS builder
ENV NEXT_PUBLIC_REPORT_SERVICE_URL=https://api.auratest.dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production stage
FROM node:20.15-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Only copy production necessities
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Use a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]

# Development stage (separated completely)
FROM node:20.15-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache g++ make py3-pip libc6-compat
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]