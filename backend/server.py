from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from datetime import datetime, timedelta

# Import our models and modules
from models import *
from auth import hash_password, verify_password, create_access_token, get_current_business_id
from database import db_manager
from carbon_calculator import calculate_carbon_footprint

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI(title="Carbon Credit API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()


# ==================== AUTHENTICATION ENDPOINTS ====================

@api_router.post("/auth/register", response_model=Token)
async def register_business(business_data: BusinessCreate):
    """Register a new business"""
    # Check if business already exists
    existing_business = await db_manager.get_business_by_email(business_data.email)
    if existing_business:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Business with this email already exists"
        )
    
    # Hash password and create business
    hashed_password = hash_password(business_data.password)
    business = Business(
        name=business_data.name,
        email=business_data.email,
        password_hash=hashed_password,
        industry=business_data.industry,
        size=business_data.size,
        address=business_data.address or {}
    )
    
    # Save to database
    created_business = await db_manager.create_business(business)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": created_business.id, "email": created_business.email}
    )
    
    return Token(
        access_token=access_token,
        business_id=created_business.id,
        business_name=created_business.name
    )


@api_router.post("/auth/login", response_model=Token)
async def login_business(login_data: BusinessLogin):
    """Login business"""
    business = await db_manager.get_business_by_email(login_data.email)
    if not business or not verify_password(login_data.password, business.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(
        data={"sub": business.id, "email": business.email}
    )
    
    return Token(
        access_token=access_token,
        business_id=business.id,
        business_name=business.name
    )


# ==================== BUSINESS PROFILE ENDPOINTS ====================

@api_router.get("/business/profile", response_model=BusinessResponse)
async def get_business_profile(business_id: str = Depends(get_current_business_id)):
    """Get business profile"""
    business = await db_manager.get_business_by_id(business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    return BusinessResponse(**business.dict())


@api_router.put("/business/profile", response_model=BusinessResponse)
async def update_business_profile(
    update_data: dict,
    business_id: str = Depends(get_current_business_id)
):
    """Update business profile"""
    # Remove sensitive fields
    update_data.pop("id", None)
    update_data.pop("password_hash", None)
    update_data.pop("created_at", None)
    
    success = await db_manager.update_business(business_id, update_data)
    if not success:
        raise HTTPException(status_code=404, detail="Business not found")
    
    updated_business = await db_manager.get_business_by_id(business_id)
    return BusinessResponse(**updated_business.dict())


# ==================== CARBON CALCULATOR ENDPOINTS ====================

@api_router.post("/calculator/calculate")
async def calculate_emissions(
    calculation_data: CarbonFootprintCreate,
    business_id: str = Depends(get_current_business_id)
):
    """Calculate carbon footprint for business"""
    # Calculate emissions
    result = calculate_carbon_footprint(calculation_data)
    
    # Save calculation to database
    footprint = CarbonFootprint(
        business_id=business_id,
        energy_data=calculation_data.energy_data,
        transportation_data=calculation_data.transportation_data,
        operations_data=calculation_data.operations_data,
        supply_chain_data=calculation_data.supply_chain_data,
        total_emissions=result["total_emissions"],
        breakdown=result["breakdown"]
    )
    
    await db_manager.save_carbon_footprint(footprint)
    
    return result


@api_router.get("/calculator/history")
async def get_calculation_history(business_id: str = Depends(get_current_business_id)):
    """Get carbon footprint calculation history"""
    footprints = await db_manager.get_carbon_footprints(business_id)
    return footprints


# ==================== CARBON PROJECTS MARKETPLACE ====================

@api_router.get("/projects", response_model=List[CarbonProject])
async def get_carbon_projects(project_type: Optional[str] = None):
    """Get all carbon offset projects"""
    projects = await db_manager.get_all_projects(project_type)
    return projects


@api_router.get("/projects/{project_id}", response_model=CarbonProject)
async def get_project_details(project_id: str):
    """Get specific project details"""
    project = await db_manager.get_project_by_id(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@api_router.post("/credits/purchase")
async def purchase_carbon_credits(
    purchase_data: CreditPurchase,
    business_id: str = Depends(get_current_business_id)
):
    """Purchase carbon credits from a project"""
    # Get project details
    project = await db_manager.get_project_by_id(purchase_data.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check credit availability
    if project.available_credits < purchase_data.credits:
        raise HTTPException(
            status_code=400, 
            detail=f"Only {project.available_credits} credits available"
        )
    
    # Calculate total amount
    total_amount = purchase_data.credits * project.price_per_credit
    
    # Create transaction
    transaction = CreditTransaction(
        business_id=business_id,
        project_id=purchase_data.project_id,
        project_name=project.name,
        credits_purchased=purchase_data.credits,
        price_per_credit=project.price_per_credit,
        total_amount=total_amount,
        payment_status="completed"  # For now, mark as completed
    )
    
    # Save transaction and update project credits
    await db_manager.create_transaction(transaction)
    await db_manager.update_project_credits(purchase_data.project_id, purchase_data.credits)
    
    # Update business offset credits
    business = await db_manager.get_business_by_id(business_id)
    new_total_credits = business.offset_credits + purchase_data.credits
    await db_manager.update_business(business_id, {"offset_credits": new_total_credits})
    
    # Auto-generate certificate if business becomes carbon neutral
    if new_total_credits >= business.carbon_footprint and business.carbon_footprint > 0:
        certificate = Certificate(
            business_id=business_id,
            business_name=business.name,
            certificate_type="carbon_neutral",
            valid_until=datetime.utcnow() + timedelta(days=365),
            credits_offset=new_total_credits
        )
        await db_manager.create_certificate(certificate)
    
    return {
        "transaction_id": transaction.id,
        "message": "Credits purchased successfully",
        "total_amount": total_amount,
        "credits_purchased": purchase_data.credits
    }


@api_router.get("/credits/transactions")
async def get_credit_transactions(business_id: str = Depends(get_current_business_id)):
    """Get credit purchase history"""
    transactions = await db_manager.get_transactions(business_id)
    return transactions


# ==================== DASHBOARD ENDPOINTS ====================

@api_router.get("/dashboard", response_model=DashboardData)
async def get_dashboard_data(business_id: str = Depends(get_current_business_id)):
    """Get business dashboard data"""
    dashboard_data = await db_manager.get_dashboard_data(business_id)
    if not dashboard_data:
        raise HTTPException(status_code=404, detail="Business not found")
    return dashboard_data


# ==================== CERTIFICATE ENDPOINTS ====================

@api_router.get("/certificates", response_model=List[Certificate])
async def get_certificates(business_id: str = Depends(get_current_business_id)):
    """Get business certificates"""
    certificates = await db_manager.get_certificates(business_id)
    return certificates


@api_router.post("/certificates/generate")
async def generate_certificate(
    certificate_data: dict,
    business_id: str = Depends(get_current_business_id)
):
    """Generate a new certificate"""
    business = await db_manager.get_business_by_id(business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    certificate = Certificate(
        business_id=business_id,
        business_name=business.name,
        certificate_type=certificate_data.get("type", "carbon_neutral"),
        valid_until=datetime.utcnow() + timedelta(days=365),
        credits_offset=business.offset_credits
    )
    
    created_cert = await db_manager.create_certificate(certificate)
    return {"message": "Certificate generated successfully", "certificate_id": created_cert.id}


# ==================== ECO PRODUCTS ENDPOINTS ====================

@api_router.get("/products", response_model=List[EcoProduct])
async def get_eco_products(category: Optional[str] = None):
    """Get eco-friendly products"""
    products = await db_manager.get_all_products(category)
    return products


@api_router.post("/products", response_model=EcoProduct)
async def create_eco_product(
    product_data: EcoProductCreate,
    business_id: str = Depends(get_current_business_id)
):
    """Create new eco-friendly product"""
    product = EcoProduct(**product_data.dict())
    created_product = await db_manager.create_product(product)
    return created_product


@api_router.post("/products/contact")
async def contact_product_brand(
    contact_data: ContactBrand,
    business_id: str = Depends(get_current_business_id)
):
    """Contact product brand (mock implementation)"""
    product = await db_manager.get_product_by_id(contact_data.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # In real implementation, this would send an email
    return {
        "message": f"Your message has been sent to {product.brand}",
        "product_name": product.name,
        "brand": product.brand
    }


# ==================== BASIC ENDPOINTS ====================

@api_router.get("/")
async def root():
    return {"message": "Carbon Credit API is running"}


@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    pass  # Database connections handled by database.py