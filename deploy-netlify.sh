#!/bin/bash

# Build the frontend
echo "Building frontend..."
cd frontend
npm install
npm run build

# Create a new Netlify site using their API
echo "Deploying to Netlify..."
cd build
npx netlify-cli deploy --prod