#!/bin/bash

# Carbon Credit Backend Deployment Script for AWS Lightsail
echo "🌱 Deploying Carbon Credit Backend to AWS Lightsail"
echo "=================================================="

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Python 3 and pip
echo "🐍 Installing Python 3 and pip..."
sudo apt install -y python3 python3-pip python3-venv

# Install Node.js (for any frontend build processes if needed)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Create project directory
echo "📁 Creating project directory..."
mkdir -p /opt/carbon-credit-backend
cd /opt/carbon-credit-backend

# Copy backend files (you'll need to upload these first)
echo "📋 Please ensure backend files are uploaded to /opt/carbon-credit-backend/"
echo "Required files:"
echo "  - main.py"
echo "  - requirements.txt"
echo "  - .env"

# Create Python virtual environment
echo "🔧 Creating Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
echo "📚 Installing Python dependencies..."
pip install -r requirements.txt

# Install uWSGI for production deployment
echo "🚀 Installing uWSGI..."
pip install uwsgi

# Create uWSGI configuration
echo "⚙️ Creating uWSGI configuration..."
cat > carbon_credit.ini << EOF
[uwsgi]
module = main:app
master = true
processes = 4
socket = /tmp/carbon_credit.sock
chmod-socket = 660
vacuum = true
die-on-term = true

# Logging
logto = /var/log/uwsgi/carbon_credit.log
logfile-chmod = 644

# Environment variables
env = MONGODB_URI=mongodb://localhost:27017
env = DB_NAME=carbon_credit
env = JWT_SECRET=carbon_credit_secret_key_2025
env = GOOGLE_CLIENT_ID=79003976501-2bdj61ah4qkue7In5hc0atjc7n1d45r4.apps.googleusercontent.com
env = GOOGLE_CLIENT_SECRET=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
env = GOOGLE_REDIRECT_URI=http://54.227.62.67:8000/api/auth/google/callback
env = FRONTEND_URL=https://creditcarbon.netlify.app
EOF

# Create log directory
sudo mkdir -p /var/log/uwsgi
sudo chown -R $(whoami):$(whoami) /var/log/uwsgi

# Create systemd service file
echo "🔧 Creating systemd service..."
sudo tee /etc/systemd/system/carbon-credit-backend.service > /dev/null <<EOF
[Unit]
Description=Carbon Credit Backend API
After=network.target

[Service]
User=$(whoami)
Group=$(whoami)
WorkingDirectory=/opt/carbon-credit-backend
Environment="PATH=/opt/carbon-credit-backend/venv/bin"
ExecStart=/opt/carbon-credit-backend/venv/bin/uwsgi --ini carbon_credit.ini
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd daemon
sudo systemctl daemon-reload

# Enable and start the service
echo "🚀 Starting Carbon Credit Backend service..."
sudo systemctl enable carbon-credit-backend
sudo systemctl start carbon-credit-backend

# Check service status
echo "📊 Checking service status..."
sudo systemctl status carbon-credit-backend --no-pager

# Configure firewall to allow port 8000
echo "🔥 Configuring firewall..."
sudo ufw allow 8000
sudo ufw allow 22
sudo ufw --force enable

echo ""
echo "🎉 Deployment Complete!"
echo "========================="
echo "🌐 Backend API: http://54.227.62.67:8000"
echo "📋 API Health Check: http://54.227.62.67:8000/health"
echo "🔧 Service Status: sudo systemctl status carbon-credit-backend"
echo "📝 View Logs: sudo journalctl -u carbon-credit-backend -f"
echo ""
echo "📋 Next Steps:"
echo "1. Update frontend .env to: REACT_APP_BACKEND_URL=http://54.227.62.67:8000"
echo "2. Test registration: curl -X POST http://54.227.62.67:8000/api/auth/register -H 'Content-Type: application/json' -d '{\"business_name\":\"Test\",\"email\":\"test@example.com\",\"password\":\"test123\"}'"
echo "3. Test login: curl -X POST http://54.227.62.67:8000/api/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"test@example.com\",\"password\":\"test123\"}'"
echo ""
echo "✅ Your Carbon Credit Backend is now deployed and running!"
