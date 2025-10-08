# 🚀 Carbon Credit Management System - Netlify + Railway Deployment

## 🌱 **Option A: Netlify + Railway Deployment Guide**

### ✅ **What's Ready:**
- ✅ Frontend build created
- ✅ Netlify configuration ready
- ✅ Railway configuration ready
- ✅ Production requirements prepared

### 📋 **Step 1: Deploy Frontend to Netlify**

#### **Method A: Netlify CLI (Recommended)**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from your project directory
netlify deploy --prod --dir=frontend/build
```

#### **Method B: Netlify Web Interface**
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login with GitHub
3. Click "New site from Git"
4. Connect your GitHub repository
5. Set build settings:
   - **Build command**: `cd frontend && npm run build`
   - **Publish directory**: `frontend/build`
6. Deploy!

### 📋 **Step 2: Deploy Backend to Railway**

#### **Method A: Railway CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy backend
cd backend
railway deploy
```

#### **Method B: Railway Web Interface**
1. Go to [railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Connect your GitHub repository
5. Select the backend folder
6. Add environment variables:
   - `MONGO_URL`: Your MongoDB connection string
   - `JWT_SECRET`: Your secret key
7. Deploy!

### 📋 **Step 3: Configure Domain**

#### **Register Domain at Freenom:**
1. Go to [freenom.com](https://freenom.com)
2. Search for "carboncredits.tk"
3. Register the free domain
4. Configure DNS:
   - **A Record**: Point to Netlify IP
   - **CNAME**: www.carboncredits.tk → carboncredits.tk

#### **Connect Domain to Netlify:**
1. In Netlify dashboard, go to "Domain settings"
2. Add custom domain: "carboncredits.tk"
3. Configure DNS as instructed
4. Enable HTTPS

### 📋 **Step 4: Environment Variables**

#### **Frontend (Netlify):**
- `REACT_APP_BACKEND_URL`: https://your-railway-app.railway.app
- `REACT_APP_DOMAIN`: carboncredits.tk
- `REACT_APP_SITE_NAME`: Carbon Credit Management System

#### **Backend (Railway):**
- `MONGO_URL`: mongodb://localhost:27017 (or MongoDB Atlas)
- `DB_NAME`: carbon_credit
- `JWT_SECRET`: your-secret-key
- `CORS_ORIGINS`: https://carboncredits.tk,https://your-netlify-app.netlify.app

### 🎯 **Final URLs:**
- **Frontend**: https://carboncredits.tk
- **Backend**: https://your-railway-app.railway.app
- **API Docs**: https://your-railway-app.railway.app/docs

### 💰 **Cost: FREE!**
- ✅ Netlify: Free tier (100GB bandwidth, 300 build minutes)
- ✅ Railway: Free tier (512MB RAM, 1GB storage)
- ✅ Domain: Free from Freenom
- ✅ Total cost: $0/month

### 🔧 **Quick Commands:**

```bash
# Build frontend
cd frontend && npm run build

# Deploy to Netlify
netlify deploy --prod --dir=frontend/build

# Deploy backend to Railway
cd backend && railway deploy

# Test deployment
curl https://carboncredits.tk
curl https://your-railway-app.railway.app/api/
```

### 🎉 **Success!**
Your Carbon Credit Management System will be live at:
**https://carboncredits.tk**

Perfect for:
- ✅ Professional business platform
- ✅ Global accessibility
- ✅ HTTPS security
- ✅ Automatic deployments
- ✅ Scalable infrastructure



