#!/bin/bash
set -e

# Start Docker daemon
echo "Starting Docker daemon..."
dockerd --host=unix:///var/run/docker.sock --host=tcp://127.0.0.1:2375 --storage-driver=overlay2 &

# Function to handle shutdown
cleanup() {
    echo "Shutting down..."
    docker compose down
    exit 0
}

# Trap SIGTERM and SIGINT
trap cleanup SIGTERM SIGINT

# Wait for Docker daemon to be ready
echo "Waiting for Docker daemon to start..."
timeout 60s bash -c 'until docker info >/dev/null 2>&1; do sleep 1; done'

if [ $? -ne 0 ]; then
    echo "Docker daemon failed to start within 60 seconds."
    exit 1
fi

echo "Docker daemon is up and running."

# Pull the images
echo "Pulling images..."
docker compose pull

# Start the services
echo "Starting services..."
docker compose up
