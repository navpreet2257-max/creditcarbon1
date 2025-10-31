from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from pydantic import BaseModel, EmailStr
from typing import Optional
import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

import uvicorn
import hashlib
import json
import requests
# # from authlib.integrations.fastapi_oauth2 import OAuth2Token  # Commented out for now - OAuth functionality disabled

# Initialize FastAPI app
app = FastAPI(
    title="Carbon Credit API",
    description="Backend API for Carbon Credit Management System",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# For demo purposes, we'll use a simple JSON file to store data
DATA_FILE = "backend_data.json"

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return {"businesses": []}

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

# Initialize data
data_store = load_data()

# Pydantic models
class BusinessRegister(BaseModel):
    business_name: str
    email: EmailStr
    password: str
    industry: Optional[str] = None
    location: Optional[str] = None

class BusinessLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class BusinessResponse(BaseModel):
    id: str
    business_name: Optional[str] = None
    email: EmailStr
    industry: Optional[str] = None
    location: Optional[str] = None

# Utility functions
def verify_password(plain_password, hashed_password):
    # Simple verification for demo (replace with proper bcrypt for production)
    return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password

def get_password_hash(password):
    # Simple hashing for demo (replace with proper bcrypt for production)
    return hashlib.sha256(password.encode()).hexdigest()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_business_from_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            return None
        # Find business in memory
        for business in data_store["businesses"]:
            if business["email"] == email:
                return business
        return None
    except JWTError:
        return None

async def get_current_business(credentials: HTTPAuthorizationCredentials = Depends(security)):
    business = get_current_business_from_token(credentials.credentials)
    if business is None:
        raise HTTPException(status_code=401, detail="Invalid token or business not found")
    return business

# Routes
@app.get("/")
async def root():
    return {"message": "Carbon Credit API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@app.post("/api/auth/register", response_model=Token)
async def register(business_data: BusinessRegister):
    # Check if business already exists
    for business in data_store["businesses"]:
        if business["email"] == business_data.email:
            raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    hashed_password = get_password_hash(business_data.password)

    # Create business document
    business = {
        "id": str(len(data_store["businesses"]) + 1),
        "business_name": business_data.business_name,
        "email": business_data.email,
        "password": hashed_password,
        "industry": business_data.industry,
        "location": business_data.location,
        "created_at": datetime.utcnow().isoformat(),
        "credits": 0,
        "is_active": True
    }

    # Add to in-memory storage
    data_store["businesses"].append(business)
    save_data(data_store)

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": business_data.email, "business_id": business["id"]},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer", "business_id": business["id"], "business_name": business_data.business_name}

@app.post("/api/auth/login", response_model=Token)
async def login(business_credentials: BusinessLogin):
    # Find business
    business = None
    for b in data_store["businesses"]:
        if b["email"] == business_credentials.email:
            business = b
            break

    if not business:
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    # Verify password
    if not verify_password(business_credentials.password, business["password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": business_credentials.email, "business_id": business["id"]},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer", "business_id": business["id"], "business_name": business["business_name"]}

@app.get("/api/business/profile", response_model=BusinessResponse)
async def get_business_profile(current_business = Depends(get_current_business)):
    return BusinessResponse(
        id=current_business["id"],
        business_name=current_business["business_name"],
        email=current_business["email"],
        industry=current_business.get("industry"),
        location=current_business.get("location")
    )

@app.put("/api/business/profile")
async def update_business_profile(
    business_data: dict,
    current_business = Depends(get_current_business)
):
    # Update business profile in memory
    for i, business in enumerate(data_store["businesses"]):
        if business["id"] == current_business["id"]:
            update_data = {k: v for k, v in business_data.items() if k != "password"}
            if "password" in business_data:
                update_data["password"] = get_password_hash(business_data["password"])

            data_store["businesses"][i].update(update_data)
            save_data(data_store)
            break

    return {"message": "Profile updated successfully"}

# Placeholder endpoints for other API calls
@app.post("/api/calculator/calculate")
async def calculate_carbon_footprint(data: dict):
    return {"message": "Calculator endpoint - to be implemented"}

@app.get("/api/calculator/history")
async def get_calculation_history(current_business = Depends(get_current_business)):
    return {"history": []}

@app.get("/api/projects")
async def get_projects():
    return {"projects": []}

@app.get("/api/dashboard")
async def get_dashboard_data(current_business = Depends(get_current_business)):
    return {"dashboard": {"credits": 0, "projects": 0}}

@app.get("/api/certificates")
async def get_certificates(current_business = Depends(get_current_business)):
    return {"certificates": []}

@app.get("/api/products")
async def get_products():
    return {"products": []}

@app.post("/api/credits/purchase")
async def purchase_credits(data: dict, current_business = Depends(get_current_business)):
    return {"message": "Credits purchase - to be implemented"}

@app.get("/api/credits/transactions")
async def get_credit_transactions(current_business = Depends(get_current_business)):
    return {"transactions": []}

# Google OAuth Configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "your-google-client-id")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "your-google-client-secret")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "https://creditcarbon.netlify.app/api/auth/google/callback")

# Frontend URLs for redirects
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Google OAuth routes
@app.get("/api/auth/google")
async def google_login():
    """Initiate Google OAuth login"""
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/auth"
        "?response_type=code"
        f"&client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={GOOGLE_REDIRECT_URI}"
        "&scope=openid%20email%20profile"
        "&access_type=offline"
    )
    return RedirectResponse(url=google_auth_url)

@app.get("/api/auth/google/callback")
async def google_callback(code: Optional[str] = None, error: Optional[str] = None):
    """Handle Google OAuth callback"""
    # Check for OAuth errors first
    if error:
        error_url = f"{FRONTEND_URL}/login?error={error}"
        return RedirectResponse(url=error_url)

    if not code:
        error_url = f"{FRONTEND_URL}/login?error=no_auth_code"
        return RedirectResponse(url=error_url)

    try:
        # Exchange code for token
        token_url = "https://oauth2.googleapis.com/token"
        token_data = {
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": GOOGLE_REDIRECT_URI,
        }

        token_response = requests.post(token_url, data=token_data)
        token_json = token_response.json()
        access_token = token_json.get("access_token")

        if not access_token:
            raise HTTPException(status_code=400, detail="Failed to get access token")

        # Get user info from Google
        userinfo_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        headers = {"Authorization": f"Bearer {access_token}"}
        userinfo_response = requests.get(userinfo_url, headers=headers)
        userinfo = userinfo_response.json()

        email = userinfo.get("email")
        name = userinfo.get("name", email.split("@")[0])

        if not email:
            raise HTTPException(status_code=400, detail="Failed to get user email")

        # Check if business exists, create if not
        business = None
        for b in data_store["businesses"]:
            if b["email"] == email:
                business = b
                break

        if not business:
            # Create new business from Google account
            business = {
                "id": str(len(data_store["businesses"]) + 1),
                "business_name": name,
                "email": email,
                "password": get_password_hash(email),  # Use email as password for Google users
                "industry": None,
                "location": None,
                "created_at": datetime.utcnow().isoformat(),
                "credits": 0,
                "is_active": True,
                "google_auth": True
            }
            data_store["businesses"].append(business)
            save_data(data_store)

        # Create JWT token
        jwt_token = create_access_token(
            data={"sub": email, "business_id": business["id"]},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )

        # Redirect to frontend with token
        frontend_url = f"{FRONTEND_URL}/dashboard?token={jwt_token}&business_id={business['id']}&business_name={business['business_name']}"
        return RedirectResponse(url=frontend_url)

    except Exception as e:
        # Redirect to login with error
        error_url = f"{FRONTEND_URL}/login?error=google_auth_failed"
        return RedirectResponse(url=error_url)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
