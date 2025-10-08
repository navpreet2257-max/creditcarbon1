#!/bin/bash

# Set error handling
set -e

# Navigate to project root
cd "$(dirname "$0")"

# Environment variables for creditcarbon997
export REACT_APP_SITE_NAME="CrediCarbon Trading Platform"
export REACT_APP_DOMAIN="creditcarbon997.netlify.app"
export REACT_APP_BACKEND_URL="https://carboncredits-backend.railway.app"

echo "Building CrediCarbon site for creditcarbon997..."

# Build with environment variables
cd frontend
npm run build

# Create necessary Netlify files
echo "Creating Netlify configuration files..."

# Create _redirects file for routing
echo "/*    /index.html   200" > build/_redirects

# Create _headers file for security
cat > build/_headers << EOL
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self' https://carboncredits-backend.railway.app; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval';
EOL

# Create .env file in build
cat > build/.env << EOL
REACT_APP_SITE_NAME=CrediCarbon Trading Platform
REACT_APP_DOMAIN=creditcarbon997.netlify.app
REACT_APP_BACKEND_URL=https://carboncredits-backend.railway.app
EOL

# Create deployment package
cd build
zip -r ../deploy.zip .

echo "=== CrediCarbon Deployment Package Ready ==="
echo "1. Go to https://app.netlify.com/drop"
echo "2. Drag and drop the deploy.zip file from $(pwd)/../deploy.zip"
echo "3. After deployment, verify these features:"
echo "   - Homepage loads at: https://creditcarbon997.netlify.app"
echo "   - Authentication (Login/Register)"
echo "   - Calculator functionality"
echo "   - Project listings"
echo "   - Credit transactions"
echo "   - Certificate generation"
echo "   - Product marketplace"
echo ""
echo "4. Test API endpoints:"
echo "   - Auth API (/api/auth)"
echo "   - Calculator API (/api/calculator)"
echo "   - Projects API (/api/projects)"
echo "   - Credits API (/api/credits)"
echo "   - Certificates API (/api/certificates)"
echo "   - Products API (/api/products)"
echo ""
echo "Build completed and ready for deployment!"