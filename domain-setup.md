# Carbon Credit Management System - Domain Setup Guide

## 🌐 Free Domain Options for Your Carbon Credit Site

### Recommended Domains:
1. **carboncredit.tk** - Direct and professional
2. **greenoffset.ml** - Emphasizes environmental impact  
3. **carbonneutral.ga** - Focuses on the end goal
4. **ecocredits.cf** - Highlights the credit system
5. **sustainablebiz.tk** - Targets business sustainability

## 🚀 How to Get Your Free Domain

### Step 1: Register Free Domain
1. Visit **Freenom.com** (most reliable free domain provider)
2. Search for your preferred domain name
3. Register with a free account
4. Choose the free option (no cost)

### Step 2: Configure DNS Settings
Once you have your domain, you'll need to point it to your server:

#### For Local Development:
- Domain: `carboncredit.tk` (or your chosen domain)
- Points to: Your local IP address (for testing)

#### For Production Deployment:
- Domain: `carboncredit.tk`
- Points to: Your production server IP

## 🔧 Application Configuration

### Frontend Configuration
Update your frontend environment variables:

```bash
# In frontend/.env
REACT_APP_BACKEND_URL=https://carboncredit.tk/api
REACT_APP_DOMAIN=carboncredit.tk
```

### Backend Configuration
Update your backend CORS settings:

```python
# In backend/server.py
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[
        "https://carboncredit.tk",
        "http://carboncredit.tk",
        "http://localhost:3000"  # Keep for development
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📋 Next Steps

1. **Register your domain** at Freenom.com
2. **Update environment variables** in both frontend and backend
3. **Configure DNS** to point to your server
4. **Test the domain** to ensure everything works
5. **Deploy to production** when ready

## 🎯 Benefits of Custom Domain

- **Professional appearance** for your Carbon Credit platform
- **Better branding** for your sustainability business
- **Easier to remember** than localhost URLs
- **Ready for production** deployment
- **SEO benefits** for your environmental platform

## 🌱 Domain Suggestions by Focus:

### Carbon Credits: carboncredit.tk, ecocredits.cf
### Sustainability: greenoffset.ml, sustainablebiz.tk  
### Climate Action: carbonneutral.ga, climatecredits.tk
### Business Focus: greenbiz.ml, carbonbiz.ga




