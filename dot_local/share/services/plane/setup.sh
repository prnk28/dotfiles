#!/bin/bash

# Plane Service Setup Script

set -e

echo "==================================="
echo "      Plane Service Setup"
echo "==================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "✓ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file to configure:"
    echo "   - SECRET_KEY (change from default for production)"
    echo "   - WEB_URL and API URLs if not using localhost"
    echo "   - Email settings if you want email notifications"
    echo "   - Storage settings for file uploads"
    echo ""
else
    echo "✓ .env file already exists"
fi

# Create necessary directories
echo ""
echo "Creating data directories..."
mkdir -p pgdata redisdata uploads
echo "✓ Data directories created"

echo ""
echo "==================================="
echo "     Setup Complete!"
echo "==================================="
echo ""
echo "To start Plane service, run:"
echo "  task services:start:plane"
echo ""
echo "Or using docker compose directly:"
echo "  docker compose up -d"
echo ""
echo "Access Plane at: http://localhost:8082"
echo ""
echo "Default admin setup will be available on first access."
echo ""