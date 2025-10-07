# Carbon Credit Platform - Backend Integration Contracts

## Overview
This document defines the API contracts and integration requirements for the Carbon Credit platform backend implementation.

## Current Mock Data (frontend/src/mock/data.js)
- **mockBusinesses**: Business profiles with carbon footprint data
- **mockCarbonProjects**: Available carbon offset projects  
- **mockEcoProducts**: Sustainable products marketplace
- **mockFootprintCalculations**: Carbon footprint calculation inputs
- **mockDashboardData**: Business dashboard metrics
- **mockCertificates**: Carbon neutral certificates
- **mockPaymentHistory**: Carbon credit purchase history

## Backend Models Required

### 1. User/Business Model
```python
class Business(BaseModel):
    id: str
    name: str
    email: str
    industry: str
    size: str  # small, medium, large
    address: dict
    created_at: datetime
    carbon_footprint: Optional[float] = 0
    offset_credits: Optional[int] = 0
    certification_status: str = "pending"  # pending, active, expired
```

### 2. Carbon Footprint Model
```python
class CarbonFootprint(BaseModel):
    id: str
    business_id: str
    calculation_date: datetime
    energy_data: dict  # electricity, gas, renewable_percentage
    transportation_data: dict  # fleet_vehicles, miles, travel
    operations_data: dict  # employees, office_space, facilities
    supply_chain_data: dict  # suppliers, shipping, packaging
    total_emissions: float
    breakdown: dict  # by category
```

### 3. Carbon Project Model
```python
class CarbonProject(BaseModel):
    id: str
    name: str
    type: str  # Forest Protection, Renewable Energy, etc.
    location: str
    price_per_credit: float
    available_credits: int
    description: str
    verified: bool = True
    impact_metrics: dict
    created_at: datetime
```

### 4. Carbon Credit Transaction Model
```python
class CreditTransaction(BaseModel):
    id: str
    business_id: str
    project_id: str
    credits_purchased: int
    price_per_credit: float
    total_amount: float
    payment_status: str  # pending, completed, failed
    stripe_payment_id: Optional[str]
    created_at: datetime
```

### 5. Certificate Model
```python
class Certificate(BaseModel):
    id: str
    business_id: str
    certificate_type: str  # carbon_neutral, quarterly_offset
    issue_date: datetime
    valid_until: datetime
    credits_offset: int
    status: str  # active, expired
    pdf_url: Optional[str]
    digital_badge_url: Optional[str]
```

### 6. Eco Product Model
```python
class EcoProduct(BaseModel):
    id: str
    name: str
    brand: str
    price: float
    category: str
    description: str
    carbon_footprint: float
    sustainability_score: int
    image_url: Optional[str]
    created_at: datetime
```

## API Endpoints Required

### Authentication & Business Management
- `POST /api/auth/register` - Business registration
- `POST /api/auth/login` - Business login
- `GET /api/business/profile` - Get business profile
- `PUT /api/business/profile` - Update business profile

### Carbon Footprint Calculator
- `POST /api/calculator/calculate` - Calculate carbon footprint
- `GET /api/calculator/history/{business_id}` - Get calculation history
- `POST /api/calculator/save` - Save calculation results

### Carbon Credit Marketplace
- `GET /api/projects` - Get all carbon projects (with filters)
- `GET /api/projects/{project_id}` - Get specific project details
- `POST /api/credits/purchase` - Purchase carbon credits
- `GET /api/credits/transactions/{business_id}` - Get transaction history

### Business Dashboard
- `GET /api/dashboard/{business_id}` - Get dashboard data
- `GET /api/dashboard/progress/{business_id}` - Get progress metrics
- `POST /api/dashboard/auto-renewal` - Configure auto-renewal settings

### Certificate Management
- `GET /api/certificates/{business_id}` - Get business certificates
- `POST /api/certificates/generate` - Generate new certificate
- `GET /api/certificates/download/{cert_id}` - Download PDF certificate
- `GET /api/certificates/badge/{cert_id}` - Get digital badge

### Eco Products
- `GET /api/products` - Get eco-friendly products (with filters)
- `POST /api/products` - Add new product (for businesses)
- `PUT /api/products/{product_id}` - Update product
- `POST /api/products/contact` - Contact product brand

### Payment Integration
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/history/{business_id}` - Get payment history

## Third-Party Integrations

### 1. Stripe Payment Processing
- **Setup**: Install stripe library, configure webhook endpoint
- **Implementation**: Create payment intents for carbon credit purchases
- **Webhook**: Handle payment confirmation events

### 2. Certificate Generation (PDF)
- **Setup**: Use reportlab or weasyprint for PDF generation
- **Template**: Professional certificate template with business branding
- **Storage**: Store generated PDFs in cloud storage (AWS S3 or local)

### 3. Email Notifications
- **Setup**: Configure SMTP or email service (SendGrid)
- **Templates**: Welcome, purchase confirmation, certificate ready
- **Triggers**: Registration, credit purchase, certificate generation

## Database Schema Relationships

```
Business (1) → (many) CarbonFootprint
Business (1) → (many) CreditTransaction
Business (1) → (many) Certificate
CarbonProject (1) → (many) CreditTransaction
Business (1) → (many) EcoProduct (if they list products)
```

## Frontend Integration Points

### Remove Mock Data
1. Replace `mockBusinesses` with API calls to `/api/business/*`
2. Replace `mockCarbonProjects` with `/api/projects`
3. Replace `mockEcoProducts` with `/api/products`
4. Replace `mockDashboardData` with `/api/dashboard/*`
5. Replace `mockCertificates` with `/api/certificates/*`
6. Replace `mockPaymentHistory` with `/api/payments/history/*`

### Authentication Context
- Implement JWT token-based authentication
- Store business_id in React context
- Protect dashboard and calculation routes

### Form Submissions
- Calculator form → POST to `/api/calculator/calculate`
- Credit purchases → POST to `/api/credits/purchase`
- Product contact → POST to `/api/products/contact`
- Certificate downloads → GET from `/api/certificates/download/*`

## Implementation Priority

### Phase 1: Core Features
1. Business authentication and profiles
2. Carbon footprint calculator backend
3. Basic carbon projects and credit purchasing
4. Dashboard data endpoints

### Phase 2: Advanced Features
1. Stripe payment integration
2. Certificate generation (PDF)
3. Email notifications
4. Eco products marketplace

### Phase 3: Business Features
1. Auto-renewal settings
2. Advanced reporting
3. Business product listings
4. Analytics and insights

## Environment Variables Required

```env
# Database
MONGO_URL=mongodb://localhost:27017/carbon_credit

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRE_HOURS=24

# Stripe (when implemented)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (when implemented)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email
SMTP_PASSWORD=your_password

# File Storage (when implemented)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET=carbon-certificates
```

## Testing Requirements

### Unit Tests
- Carbon footprint calculation logic
- Certificate generation
- Payment processing flows

### Integration Tests
- End-to-end credit purchase flow
- Calculator → Results → Purchase → Certificate
- Authentication and authorization

### API Testing
- All CRUD operations
- Error handling and validation
- Rate limiting and security

This contract ensures seamless integration between the existing frontend mock data and the backend implementation, maintaining all current functionality while adding real data persistence and business logic.