#!/bin/bash

# Configuration
DOCKER_USER="vasanthdockerx"
IMAGE_NAME="amazon-clone-all-in-one"
TAG="latest"

# Full image name
FULL_IMAGE_NAME="$DOCKER_USER/$IMAGE_NAME:$TAG"

echo "Building the meta-runner image: $FULL_IMAGE_NAME"

# Build the image
docker build -t "$FULL_IMAGE_NAME" .

echo "Build complete."

# Ask to push
read -p "Do you want to push the image to Docker Hub? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "Pushing $FULL_IMAGE_NAME..."
    docker push "$FULL_IMAGE_NAME"
    echo "Push complete! You can now use $FULL_IMAGE_NAME in your hosting service."
else
    echo "Push skipped. You can push it manually using: docker push $FULL_IMAGE_NAME"
fi
