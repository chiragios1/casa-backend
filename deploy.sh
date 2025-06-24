#!/bin/bash

# CASA Backend Deployment Script
# Usage: ./deploy.sh [production|staging]

set -e

ENV=${1:-production}
CONTAINER_NAME="casa-backend-${ENV}"
IMAGE_NAME="casa-backend:${ENV}"

echo "🚀 Starting CASA Backend deployment for ${ENV} environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker first."
    exit 1
fi

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t ${IMAGE_NAME} .

# Stop and remove existing container if it exists
if docker ps -a --format 'table {{.Names}}' | grep -q "${CONTAINER_NAME}"; then
    echo "🛑 Stopping existing container..."
    docker stop ${CONTAINER_NAME} || true
    docker rm ${CONTAINER_NAME} || true
fi

# Start new container
echo "🔄 Starting new container..."
if [ "$ENV" = "production" ]; then
    docker run -d \
        --name ${CONTAINER_NAME} \
        --restart unless-stopped \
        -p 5000:5000 \
        --env-file .env.production \
        -v $(pwd)/uploads:/app/uploads \
        -v $(pwd)/logs:/app/logs \
        ${IMAGE_NAME}
else
    docker run -d \
        --name ${CONTAINER_NAME} \
        --restart unless-stopped \
        -p 5001:5000 \
        --env-file .env.staging \
        -v $(pwd)/uploads:/app/uploads \
        -v $(pwd)/logs:/app/logs \
        ${IMAGE_NAME}
fi

# Wait for container to be ready
echo "⏳ Waiting for container to be ready..."
sleep 10

# Check if container is running
if docker ps | grep -q "${CONTAINER_NAME}"; then
    echo "✅ Container is running successfully!"
    
    # Test API endpoint
    if curl -f -s http://localhost:5000/ > /dev/null; then
        echo "✅ API is responding!"
        echo "🎉 Deployment completed successfully!"
        echo "📍 API URL: http://localhost:5000"
    else
        echo "⚠️  Container is running but API is not responding yet. Please check logs:"
        echo "   docker logs ${CONTAINER_NAME}"
    fi
else
    echo "❌ Container failed to start. Check logs:"
    echo "   docker logs ${CONTAINER_NAME}"
    exit 1
fi

# Show container status
echo ""
echo "📊 Container Status:"
docker ps | grep ${CONTAINER_NAME}

echo ""
echo "📝 To view logs: docker logs -f ${CONTAINER_NAME}"
echo "🛑 To stop: docker stop ${CONTAINER_NAME}"
echo "🔄 To restart: docker restart ${CONTAINER_NAME}" 