#!/bin/bash

# Set error handling
set -e

# Navigate to project root
cd "$(dirname "$0")"

# Environment variables
export REACT_APP_SITE_NAME="Carbon Credit Trading Platform"
export REACT_APP_DOMAIN="carbon-credits-trading.netlify.app"

# Install and build frontend
echo "Installing and building frontend..."
cd frontend
npm install --legacy-peer-deps
REACT_APP_SITE_NAME="$REACT_APP_SITE_NAME" REACT_APP_DOMAIN="$REACT_APP_DOMAIN" npm run build

# Create Netlify deployment using curl
echo "Deploying to Netlify..."
cd build

# Create a zip file of the build
zip -r ../deploy.zip .

# Instructions for deployment
echo "To deploy your Carbon Credits Trading Platform:"
echo "1. Go to https://app.netlify.com/drop"
echo "2. Drag and drop the deploy.zip file from $(pwd)/../deploy.zip"
echo "3. After deployment, configure in Netlify dashboard:"
echo "   - Site name: carbon-credits-trading"
echo "   - Domain settings: Add custom domain if needed"
echo "   - Environment variables:"
echo "     REACT_APP_SITE_NAME=\"$REACT_APP_SITE_NAME\""
echo "     REACT_APP_DOMAIN=\"$REACT_APP_DOMAIN\""
echo "     REACT_APP_BACKEND_URL=\"https://carboncredits-backend.railway.app\""

# Clean up
cd ..
echo "Build completed and zip file created at: $(pwd)/deploy.zip"