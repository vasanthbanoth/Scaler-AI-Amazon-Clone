# Amazon Clone - E-Commerce Platform

This is a full-stack e-commerce application built to replicate the Amazon shopping experience. It features a modern tech stack with a FastAPI backend, Next.js frontend, and Nginx reverse proxy, all containerized with Docker.

## Features

### Core Features
- **Product Listing Page**: Grid layout with product cards showing image, name, price, and "Add to Cart".
- **Product Detail Page**: Image gallery, description, price, stock status, "Add to Cart", and "Buy Now".
- **Shopping Cart**: View items, update quantities, remove items, and order summary with subtotal.
- **Order Placement**: Checkout flow with shipping address and order review.
- **Order Confirmation**: Displays unique Order ID after successful placement.

### Bonus Features
- **Responsive Design**: Optimized for mobile, tablet, and desktop.
- **Wishlist**: Save favorite products for later.
- **Order History**: Track past orders and view details.
- **Search & Filter**: Find products efficiently by name or category.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (React 19), [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/), [Shadcn UI](https://ui.shadcn.com/)
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python), [SQLAlchemy](https://www.sqlalchemy.org/)
- **Database**: SQLite (Async)
- **Reverse Proxy**: [Nginx](https://www.nginx.com/)
- **Infrastructure**: [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/)

## Prerequisites

- Docker and Docker Compose installed on your machine.

## Setup Instructions

### 1. Create Docker Compose File
Create a `docker-compose.yaml` file in your project root and paste the following content:

```yaml
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    image: vasanthdockerx/amazon-clone-backend:latest
    networks:
      - amazon-clone-net
    expose:
      - "8000"
    environment:
      - PYTHONUNBUFFERED=1

  frontend:
    build:
      context: ./ui
      dockerfile: Dockerfile
    image: vasanthdockerx/amazon-clone-frontend:latest
    networks:
      - amazon-clone-net
    expose:
      - "3000"
    depends_on:
      - backend

  nginx:
    build:
      context: ./nginx
      dockerfile: Dockerfile
    image: vasanthdockerx/amazon-clone-nginx:latest
    ports:
      - "80:80"
    networks:
      - amazon-clone-net
    depends_on:
      - frontend
      - backend

networks:
  amazon-clone-net:
    driver: bridge
```

### 2. Run the Application
Open your terminal in the directory containing the `docker-compose.yaml` and run:

```bash
docker-compose up --build
```

### 3. Access the Platform
Once the containers are running, you can access the application at:
- **Frontend**: [http://localhost](http://localhost) (via Nginx on port 80)

## Project Structure

```text
.
├── database/        # Database models and configuration
├── models/          # Pydantic schemas for API
├── modules/         # Utility modules (logger, etc.)
├── nginx/           # Nginx configuration and Dockerfile
├── routes/          # FastAPI route handlers
├── ui/              # Next.js frontend application
│   ├── src/app/     # Next.js App Router pages
│   └── src/components/ # Reusable UI components
├── main.py          # FastAPI entry point
└── docker-compose.yaml
```

## Assumptions
- **Authentication**: A default user is assumed to be logged in for cart and order operations.
- **Persistence**: SQLite is used for demonstration purposes. Data will not persist across container restarts.
- **Payments**: Payment processing is simulated for the assignment.

---
*Created as part of the SDE Intern Fullstack Assignment.*
