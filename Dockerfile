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

# copy our nginx config
COPY --from=builder /app/default.conf /etc/nginx/conf.d/default.conf

# copy the prerendered files & licenses (if you need them served)
COPY --from=builder /app/dist/clinic-flow/3rdpartylicenses.txt    /usr/share/nginx/html/
COPY --from=builder /app/dist/clinic-flow/prerendered-routes.json /usr/share/nginx/html/

# copy the browser build *contents* into the nginx root
COPY --from=builder /app/dist/clinic-flow/browser/ /usr/share/nginx/html/

# fix permissions so the 'nginx' user can read everything
RUN chown -R nginx:nginx /usr/share/nginx/html \
 && chmod -R 755               /usr/share/nginx/html

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
