# Multi-stage Dockerfile for Vite React frontend

########################
# 1) Build stage
########################
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* .npmrc* ./
RUN npm install --silent || npm install --silent --legacy-peer-deps

# Copy the rest of the frontend source
COPY . .

# Build static assets
RUN npm run build

########################
# 2) Production stage (Nginx)
########################
FROM nginx:1.27-alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: custom nginx config for SPA routing
# We create a basic config that serves index.html for all routes
RUN rm /etc/nginx/conf.d/default.conf

COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Optionally, proxy API calls to backend if same host
    # location /api/ {
    #     proxy_pass http://backend:3000;
    # }
}
EOF

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
