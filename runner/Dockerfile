FROM ubuntu:22.04

# Avoid prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install prerequisites
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    iptables \
    kmod \
    bash

# Add Docker's official GPG key
RUN mkdir -m 0755 -p /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the Docker repository
RUN echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine and Compose plugin
RUN apt-get update && apt-get install -y \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin

# Set up working directory
WORKDIR /app

# Copy the pull-only docker-compose file and entrypoint script
COPY docker-compose.yaml .
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Expose port 80 (where Nginx will be serving the app)
EXPOSE 80

# Use a volume for Docker internals to improve performance and reliability
VOLUME /var/lib/docker

# Run the entrypoint script
ENTRYPOINT ["./entrypoint.sh"]
