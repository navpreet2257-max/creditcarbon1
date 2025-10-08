#!/bin/bash

# Set error handling
set -e

# Navigate to project root
cd "$(dirname "$0")"

# Create the build folder if it doesn't exist
mkdir -p frontend/build

# Create environment file in the build directory
cat > frontend/build/.env << EOL
REACT_APP_SITE_NAME=CrediCarbon Trading Platform
REACT_APP_DOMAIN=credicarbon.netlify.app
REACT_APP_BACKEND_URL=https://carboncredits-backend.railway.app
EOL

# Create a _headers file for security headers
cat > frontend/build/_headers << EOL
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
EOL

# Create _redirects file for routing
cat > frontend/build/_redirects << EOL
/api/*  https://carboncredits-backend.railway.app/api/:splat  200
/*      /index.html                                           200
EOL

# Build the frontend
cd frontend
npm run build

# Create the deployment package
cd build
zip -r deploy.zip .

echo "===== Netlify Deployment Instructions ====="
echo "1. Go to https://app.netlify.com/drop"
echo "2. Drop the deploy.zip file from: $(pwd)/deploy.zip"
echo "3. Once deployed, check these environment variables are set:"
echo ""
echo "REACT_APP_SITE_NAME = CrediCarbon Trading Platform"
echo "REACT_APP_DOMAIN = credicarbon.netlify.app"
echo "REACT_APP_BACKEND_URL = https://carboncredits-backend.railway.app"
echo ""
echo "4. Verify the site is accessible at: https://credicarbon.netlify.app"