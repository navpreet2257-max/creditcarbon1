#!/bin/bash

# Set error handling
set -e

# Navigate to project root
cd "$(dirname "$0")"

# Environment variables
export REACT_APP_SITE_NAME="CrediCarbon Trading Platform"
export REACT_APP_DOMAIN="credicarbon.netlify.app"
export REACT_APP_BACKEND_URL="https://carboncredits-backend.railway.app"

# Install and build frontend
echo "Building CrediCarbon site..."
cd frontend
npm install --legacy-peer-deps
REACT_APP_SITE_NAME="$REACT_APP_SITE_NAME" REACT_APP_DOMAIN="$REACT_APP_DOMAIN" REACT_APP_BACKEND_URL="$REACT_APP_BACKEND_URL" npm run build

# Create necessary Netlify files
echo "Creating Netlify configuration files..."

# Create _redirects file
echo "/* /index.html 200" > build/_redirects

# Create .env file
echo "REACT_APP_SITE_NAME=$REACT_APP_SITE_NAME
REACT_APP_DOMAIN=$REACT_APP_DOMAIN
REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL" > build/.env

# Create deploy package
echo "Creating deployment package..."
cd build
zip -r ../deploy.zip .

echo "=== CrediCarbon Deployment Package Ready ==="
echo "1. Go to https://app.netlify.com/drop"
echo "2. Drag and drop the deploy.zip file from $(pwd)/../deploy.zip"
echo "3. After deployment, verify these settings in Netlify:"
echo "   - Site name: credicarbon"
echo "   - Domain: credicarbon.netlify.app"
echo "   Environment variables are included in the build"
echo ""
echo "Build completed and ready for deployment!"