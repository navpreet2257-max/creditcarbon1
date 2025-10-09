#!/bin/bash

# Carbon Credit Management System - Domain Setup Script
# This script helps you configure your application for a custom domain

echo "🌱 Carbon Credit Management System - Domain Setup"
echo "=================================================="

# Domain options
echo "📋 Available Free Domain Options:"
echo "1. carboncredit.tk - Direct and professional"
echo "2. greenoffset.ml - Emphasizes environmental impact"
echo "3. carbonneutral.ga - Focuses on the end goal"
echo "4. ecocredits.cf - Highlights the credit system"
echo "5. sustainablebiz.tk - Targets business sustainability"
echo ""

# Get user choice
read -p "Enter your chosen domain (e.g., carboncredit.tk): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo "❌ No domain entered. Exiting."
    exit 1
fi

echo "🔧 Configuring application for domain: $DOMAIN"

# Update frontend environment
echo "📝 Updating frontend configuration..."
cat > frontend/.env.production << EOF
REACT_APP_BACKEND_URL=https://$DOMAIN/api
REACT_APP_DOMAIN=$DOMAIN
REACT_APP_SITE_NAME=Carbon Credit Management System
REACT_APP_SITE_DESCRIPTION=Help Your Business Go Carbon Neutral
EOF

# Update backend CORS configuration
echo "📝 Updating backend CORS configuration..."
cat > backend/cors-config.py << EOF
# CORS Configuration for $DOMAIN
CORS_ORIGINS = [
    "https://$DOMAIN",
    "http://$DOMAIN",
    "http://localhost:3000",  # Keep for development
    "https://localhost:3000"
]
EOF

echo "✅ Configuration files created!"
echo ""
echo "🚀 Next Steps:"
echo "1. Register your domain at Freenom.com"
echo "2. Point DNS to your server IP"
echo "3. Update your application to use the new domain"
echo "4. Test your site at https://$DOMAIN"
echo ""
echo "📚 For detailed instructions, see domain-setup.md"




