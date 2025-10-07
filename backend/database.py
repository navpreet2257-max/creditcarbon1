from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional, Dict
import os
from models import *
from datetime import datetime, timedelta

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'carbon_credit')]


class DatabaseManager:
    def __init__(self):
        self.businesses = db.businesses
        self.carbon_footprints = db.carbon_footprints
        self.carbon_projects = db.carbon_projects
        self.credit_transactions = db.credit_transactions
        self.certificates = db.certificates
        self.eco_products = db.eco_products

    # Business operations
    async def create_business(self, business: Business) -> Business:
        await self.businesses.insert_one(business.dict())
        return business

    async def get_business_by_email(self, email: str) -> Optional[Business]:
        business_doc = await self.businesses.find_one({"email": email})
        return Business(**business_doc) if business_doc else None

    async def get_business_by_id(self, business_id: str) -> Optional[Business]:
        business_doc = await self.businesses.find_one({"id": business_id})
        return Business(**business_doc) if business_doc else None

    async def update_business(self, business_id: str, update_data: Dict) -> bool:
        result = await self.businesses.update_one(
            {"id": business_id}, {"$set": update_data}
        )
        return result.modified_count > 0

    # Carbon footprint operations
    async def save_carbon_footprint(self, footprint: CarbonFootprint) -> CarbonFootprint:
        await self.carbon_footprints.insert_one(footprint.dict())
        # Update business carbon_footprint
        await self.update_business(footprint.business_id, {
            "carbon_footprint": footprint.total_emissions
        })
        return footprint

    async def get_carbon_footprints(self, business_id: str) -> List[CarbonFootprint]:
        cursor = self.carbon_footprints.find({"business_id": business_id})
        footprints = []
        async for doc in cursor:
            footprints.append(CarbonFootprint(**doc))
        return footprints

    # Carbon projects operations
    async def get_all_projects(self, project_type: Optional[str] = None) -> List[CarbonProject]:
        filter_query = {}
        if project_type and project_type != "all":
            filter_query["type"] = project_type
        
        cursor = self.carbon_projects.find(filter_query)
        projects = []
        async for doc in cursor:
            projects.append(CarbonProject(**doc))
        return projects

    async def get_project_by_id(self, project_id: str) -> Optional[CarbonProject]:
        project_doc = await self.carbon_projects.find_one({"id": project_id})
        return CarbonProject(**project_doc) if project_doc else None

    async def create_project(self, project: CarbonProject) -> CarbonProject:
        await self.carbon_projects.insert_one(project.dict())
        return project

    async def update_project_credits(self, project_id: str, credits_used: int) -> bool:
        result = await self.carbon_projects.update_one(
            {"id": project_id}, 
            {"$inc": {"available_credits": -credits_used}}
        )
        return result.modified_count > 0

    # Credit transactions
    async def create_transaction(self, transaction: CreditTransaction) -> CreditTransaction:
        await self.credit_transactions.insert_one(transaction.dict())
        return transaction

    async def update_transaction_status(self, transaction_id: str, status: str, stripe_id: Optional[str] = None) -> bool:
        update_data = {"payment_status": status}
        if stripe_id:
            update_data["stripe_payment_id"] = stripe_id
        
        result = await self.credit_transactions.update_one(
            {"id": transaction_id}, {"$set": update_data}
        )
        return result.modified_count > 0

    async def get_transactions(self, business_id: str) -> List[CreditTransaction]:
        cursor = self.credit_transactions.find({"business_id": business_id})
        transactions = []
        async for doc in cursor:
            transactions.append(CreditTransaction(**doc))
        return transactions

    async def get_completed_transactions(self, business_id: str) -> List[CreditTransaction]:
        cursor = self.credit_transactions.find({
            "business_id": business_id, 
            "payment_status": "completed"
        })
        transactions = []
        async for doc in cursor:
            transactions.append(CreditTransaction(**doc))
        return transactions

    # Certificates
    async def create_certificate(self, certificate: Certificate) -> Certificate:
        await self.certificates.insert_one(certificate.dict())
        return certificate

    async def get_certificates(self, business_id: str) -> List[Certificate]:
        cursor = self.certificates.find({"business_id": business_id})
        certificates = []
        async for doc in cursor:
            certificates.append(Certificate(**doc))
        return certificates

    # Eco products
    async def get_all_products(self, category: Optional[str] = None) -> List[EcoProduct]:
        filter_query = {}
        if category and category != "all":
            filter_query["category"] = category
        
        cursor = self.eco_products.find(filter_query)
        products = []
        async for doc in cursor:
            products.append(EcoProduct(**doc))
        return products

    async def create_product(self, product: EcoProduct) -> EcoProduct:
        await self.eco_products.insert_one(product.dict())
        return product

    async def get_product_by_id(self, product_id: str) -> Optional[EcoProduct]:
        product_doc = await self.eco_products.find_one({"id": product_id})
        return EcoProduct(**product_doc) if product_doc else None

    # Dashboard data
    async def get_dashboard_data(self, business_id: str) -> DashboardData:
        # Get business info
        business = await self.get_business_by_id(business_id)
        if not business:
            return None

        # Get completed transactions
        transactions = await self.get_completed_transactions(business_id)
        
        # Calculate totals
        total_credits = sum(t.credits_purchased for t in transactions)
        total_footprint = business.carbon_footprint or 0
        projects_supported = len(set(t.project_id for t in transactions))
        
        # Get certificates
        certificates = await self.get_certificates(business_id)
        active_certificates = [c for c in certificates if c.status == "active"]
        
        # Generate monthly progress (mock data for now)
        monthly_progress = []
        for i in range(6):
            month_date = datetime.utcnow() - timedelta(days=30 * i)
            monthly_progress.append({
                "month": month_date.strftime("%b"),
                "footprint": max(0, total_footprint/12 + (i * 5)),  # Simulate variation
                "offset": max(0, total_credits/12 + (i * 3))
            })
        monthly_progress.reverse()

        return DashboardData(
            total_footprint=total_footprint,
            offset_credits=total_credits,
            carbon_neutral_date="2024-03-15" if total_credits >= total_footprint else None,
            monthly_progress=monthly_progress,
            projects_supported=projects_supported,
            certificates_earned=len(active_certificates),
            impact_metrics={
                "trees_equivalent": int(total_credits * 2.3),
                "cars_off_road": int(total_credits * 0.035),
                "homes_annual_energy": int(total_credits * 0.062)
            }
        )


# Global database instance
db_manager = DatabaseManager()