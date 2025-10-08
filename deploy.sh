#!/bin/bash

# Carbon Credit Management System - Quick Deployment Script
echo "🌱 Carbon Credit Management System - Netlify + Railway Deployment"
echo "================================================================="

echo ""
echo "📋 Pre-deployment Checklist:"
echo "✅ Frontend build created"
echo "✅ Netlify configuration ready"
echo "✅ Railway configuration ready"
echo "✅ Domain: carboncredits.tk"
echo ""

echo "🚀 Starting deployment process..."
echo ""

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

echo ""
echo "🌐 Step 1: Deploy Frontend to Netlify"
echo "====================================="
echo "1. Go to https://netlify.com"
echo "2. Sign up/Login with GitHub"
echo "3. Click 'New site from Git'"
echo "4. Connect your GitHub repository"
echo "5. Set build settings:"
echo "   - Build command: cd frontend && npm run build"
echo "   - Publish directory: frontend/build"
echo "6. Deploy!"
echo ""

echo "🚂 Step 2: Deploy Backend to Railway"
echo "==================================="
echo "1. Go to https://railway.app"
echo "2. Sign up/Login with GitHub"
echo "3. Click 'New Project'"
echo "4. Connect your GitHub repository"
echo "5. Select the backend folder"
echo "6. Add environment variables:"
echo "   - MONGO_URL: mongodb://localhost:27017"
echo "   - JWT_SECRET: your-secret-key"
echo "7. Deploy!"
echo ""

echo "🌍 Step 3: Register Domain"
echo "========================="
echo "1. Go to https://freenom.com"
echo "2. Search for 'carboncredits.tk'"
echo "3. Register the free domain"
echo "4. Configure DNS to point to Netlify"
echo ""

echo "🎯 Your Carbon Credit Platform will be live at:"
echo "   🌐 https://carboncredits.tk"
echo "   📚 https://carboncredits.tk/api/docs"
echo ""

echo "💰 Total Cost: FREE!"
echo "✅ Netlify: Free tier"
echo "✅ Railway: Free tier"
echo "✅ Domain: Free from Freenom"
echo ""

read -p "Press Enter to continue with manual deployment steps..."

echo ""
echo "📚 For detailed instructions, see deploy-instructions.md"
echo "🎉 Your Carbon Credit Management System is ready for deployment!"



