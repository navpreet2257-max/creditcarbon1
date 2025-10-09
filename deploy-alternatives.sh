#!/bin/bash

# Carbon Credit Management System - Alternative Deployment Options
echo "🌱 Carbon Credit Management System - Deployment Alternatives"
echo "============================================================="

echo ""
echo "🎯 Your site is currently working at:"
echo "✅ Frontend: http://localhost:3000"
echo "✅ Backend: http://localhost:8000"
echo ""

echo "📋 Alternative Domain Options:"
echo "1. carboncredits.tk - Direct and professional"
echo "2. greenbusiness.ml - Business sustainability focus"
echo "3. ecocredits.ga - Environmental credits"
echo "4. sustainablebiz.cf - Sustainable business"
echo "5. carbonoffset.tk - Carbon offset focus"
echo ""

echo "🚀 Deployment Options:"
echo ""
echo "Option A: Netlify + Railway (Recommended)"
echo "  - Frontend: Deploy to Netlify"
echo "  - Backend: Deploy to Railway"
echo "  - Domain: Register at Freenom"
echo "  - Cost: FREE"
echo ""

echo "Option B: Vercel + Render"
echo "  - Frontend: Deploy to Vercel"
echo "  - Backend: Deploy to Render"
echo "  - Domain: Connect custom domain"
echo "  - Cost: FREE"
echo ""

echo "Option C: GitHub Pages + Heroku"
echo "  - Frontend: GitHub Pages"
echo "  - Backend: Heroku (free tier)"
echo "  - Domain: Custom domain support"
echo "  - Cost: FREE"
echo ""

echo "🔧 Quick Commands:"
echo ""
echo "Build for production:"
echo "  cd frontend && npm run build"
echo ""
echo "Test production build:"
echo "  cd frontend && npx serve -s build"
echo ""
echo "Deploy to Netlify:"
echo "  npx netlify-cli deploy --prod --dir=frontend/build"
echo ""

read -p "Choose deployment option (A/B/C) or press Enter to continue with local development: " choice

case $choice in
    A|a)
        echo "🚀 Setting up Netlify + Railway deployment..."
        echo "1. Install Netlify CLI: npm install -g netlify-cli"
        echo "2. Build frontend: cd frontend && npm run build"
        echo "3. Deploy: netlify deploy --prod --dir=build"
        ;;
    B|b)
        echo "🚀 Setting up Vercel + Render deployment..."
        echo "1. Install Vercel CLI: npm install -g vercel"
        echo "2. Deploy frontend: vercel"
        echo "3. Deploy backend to Render"
        ;;
    C|c)
        echo "🚀 Setting up GitHub Pages + Heroku deployment..."
        echo "1. Push to GitHub repository"
        echo "2. Enable GitHub Pages"
        echo "3. Deploy backend to Heroku"
        ;;
    *)
        echo "✅ Continuing with local development at http://localhost:3000"
        ;;
esac

echo ""
echo "📚 For detailed instructions, see alternative-setup.md"




