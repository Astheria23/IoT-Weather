# Multi-stage build for Go backend

# 1) Build stage
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Enable Go modules and turn on simple module proxy
ENV GO111MODULE=on

# Install git (often needed for private modules)
RUN apk add --no-cache git ca-certificates && update-ca-certificates

# Copy go mod/sum first for caching
COPY go.mod ./
# If you have go.sum, uncomment the next line
# COPY go.sum ./

RUN go mod download

# Copy the rest of the source
COPY . .

# Build the binary
RUN go build -o server ./

# 2) Runtime stage
FROM alpine:3.20

WORKDIR /app

# Add CA certificates for HTTPS (MongoDB Atlas, etc.)
RUN apk add --no-cache ca-certificates && update-ca-certificates

# Copy binary from build stage
COPY --from=builder /app/server /app/server

# Copy example env if you want default values (optional)
# You can still override via real env vars at runtime
# COPY .env.example /app/.env

# Expose the application port (match PORT or Fiber default 3000)
EXPOSE 3000

# Environment variables (override in deployment)
ENV PORT=3000

# Run the binary
CMD ["/app/server"]
