#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status.

echo "==> Pulling latest code (optional, if using Git)..."
# git pull

echo "==> Building services..."
docker compose build

echo "==> Stopping existing containers (if any)..."
docker compose down

echo "==> Starting containers in detached mode..."
docker compose up -d

echo "==> Cleaning up unused Docker resources (optional)..."
docker system prune -f

echo "==> Deployment complete!"