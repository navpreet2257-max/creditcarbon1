from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from datetime import datetime
import uuid


class Business(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    password_hash: str
    industry: str
    size: str  # small, medium, large
    address: Optional[Dict] = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)
    carbon_footprint: Optional[float] = 0.0
    offset_credits: Optional[int] = 0
    certification_status: str = "pending"  # pending, active, expired


class BusinessCreate(BaseModel):
    name: str
    email: str
    password: str
    industry: str
    size: str
    address: Optional[Dict] = {}


class BusinessLogin(BaseModel):
    email: str
    password: str


class BusinessResponse(BaseModel):
    id: str
    name: str
    email: str
    industry: str
    size: str
    address: Optional[Dict] = {}
    created_at: datetime
    carbon_footprint: Optional[float] = 0.0
    offset_credits: Optional[int] = 0
    certification_status: str = "pending"


class CarbonFootprint(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    business_id: str
    calculation_date: datetime = Field(default_factory=datetime.utcnow)
    energy_data: Dict  # electricity, gas, renewable_percentage
    transportation_data: Dict  # fleet_vehicles, miles, travel
    operations_data: Dict  # employees, office_space, facilities
    supply_chain_data: Dict  # suppliers, shipping, packaging
    total_emissions: float
    breakdown: Dict  # by category


class CarbonFootprintCreate(BaseModel):
    energy_data: Dict
    transportation_data: Dict
    operations_data: Dict
    supply_chain_data: Dict


class CarbonProject(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str  # Forest Protection, Renewable Energy, etc.
    location: str
    price_per_credit: float
    available_credits: int
    description: str
    verified: bool = True
    impact_metrics: Dict
    created_at: datetime = Field(default_factory=datetime.utcnow)


class CarbonProjectCreate(BaseModel):
    name: str
    type: str
    location: str
    price_per_credit: float
    available_credits: int
    description: str
    impact_metrics: Dict
    verified: bool = True


class CreditTransaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    business_id: str
    project_id: str
    project_name: str
    credits_purchased: int
    price_per_credit: float
    total_amount: float
    payment_status: str = "pending"  # pending, completed, failed
    stripe_payment_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class CreditPurchase(BaseModel):
    project_id: str
    credits: int


class Certificate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    business_id: str
    business_name: str
    certificate_type: str  # carbon_neutral, quarterly_offset
    issue_date: datetime = Field(default_factory=datetime.utcnow)
    valid_until: datetime
    credits_offset: int
    status: str = "active"  # active, expired
    pdf_url: Optional[str] = None
    digital_badge_url: Optional[str] = None


class EcoProduct(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    brand: str
    price: float
    category: str
    description: str
    carbon_footprint: float
    sustainability_score: int
    image_emoji: str  # Using emoji as placeholder for image
    created_at: datetime = Field(default_factory=datetime.utcnow)


class EcoProductCreate(BaseModel):
    name: str
    brand: str
    price: float
    category: str
    description: str
    carbon_footprint: float
    sustainability_score: int
    image_emoji: str = "📦"


class DashboardData(BaseModel):
    total_footprint: float
    offset_credits: int
    carbon_neutral_date: Optional[str]
    monthly_progress: List[Dict]
    projects_supported: int
    certificates_earned: int
    impact_metrics: Dict


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    business_id: str
    business_name: str


class ContactBrand(BaseModel):
    product_id: str
    business_email: str
    message: str