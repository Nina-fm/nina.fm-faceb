# Dockerfile multi-stage pour Nina.fm Face B
FROM node:18-alpine AS base

# Enable corepack and yarn
RUN corepack enable && corepack prepare yarn@1.22.22 --activate

# Set working directory
WORKDIR /app

# Dependencies stage
FROM base AS dependencies

# Install system dependencies
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Development stage
FROM dependencies AS development

# Copy source code
COPY . .

# Expose development port
EXPOSE 3002

# Start development server
CMD ["yarn", "dev"]

# Build stage
FROM dependencies AS build

# Build args for Nuxt environment variables
ARG SITE_URL
ARG SUPABASE_URL
ARG SUPABASE_KEY
ARG STREAM_API_URL
ARG STREAM_API_URL_FALLBACK

# Set environment variables for Nuxt build
ENV SITE_URL=${SITE_URL}
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_KEY=${SUPABASE_KEY}
ENV STREAM_API_URL=${STREAM_API_URL}
ENV STREAM_API_URL_FALLBACK=${STREAM_API_URL_FALLBACK}

# Copy source code
COPY . .

# Build application
RUN yarn build

# Production stage
FROM node:18-alpine AS production

# Enable corepack
RUN corepack enable && corepack prepare yarn@1.22.22 --activate

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxtjs

WORKDIR /app

# Copy built application
COPY --from=build --chown=nuxtjs:nodejs /app/.output ./.output
COPY --from=build --chown=nuxtjs:nodejs /app/package.json ./package.json

# Install production dependencies (skip scripts)
RUN yarn install --frozen-lockfile --production --ignore-scripts

USER nuxtjs

EXPOSE 3002

ENV NODE_ENV=production
ENV PORT=3002
ENV HOST=0.0.0.0

# Use the built server directly
CMD ["node", ".output/server/index.mjs"]
