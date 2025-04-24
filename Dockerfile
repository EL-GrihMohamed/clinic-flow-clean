# 1. Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Use your production configuration
RUN npm run build -- --configuration production

# 2. Runtime stage
FROM nginx:alpine
# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*
# Copy built files
COPY --from=builder /app/dist/clinic-flow /usr/share/nginx/html
# (Optional) Copy a custom nginx.conf if you need rewrites, caching, etc.
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
