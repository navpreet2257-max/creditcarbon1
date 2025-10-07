"""
Seed data script to populate the database with initial carbon projects and eco products
"""
import asyncio
from database import db_manager
from models import CarbonProject, EcoProduct


async def seed_carbon_projects():
    """Seed carbon offset projects"""
    projects = [
        CarbonProject(
            name="Amazon Rainforest Conservation",
            type="Forest Protection",
            location="Brazil",
            price_per_credit=25.0,
            available_credits=50000,
            description="Protecting 100,000 hectares of Amazon rainforest from deforestation",
            verified=True,
            impact_metrics={
                "trees_protected": 2500000,
                "biodiversity_species": 1200,
                "communities_supported": 45
            }
        ),
        CarbonProject(
            name="Wind Farm Development",
            type="Renewable Energy",
            location="Texas, USA",
            price_per_credit=18.0,
            available_credits=75000,
            description="Clean wind energy generation replacing fossil fuel power plants",
            verified=True,
            impact_metrics={
                "mw_capacity": 500,
                "households_powered": 150000,
                "co2_reduced": "2.5M tons/year"
            }
        ),
        CarbonProject(
            name="Clean Cookstoves Program",
            type="Community Development",
            location="Kenya",
            price_per_credit=12.0,
            available_credits=25000,
            description="Providing efficient cookstoves to reduce emissions and improve health",
            verified=True,
            impact_metrics={
                "families_benefited": 15000,
                "health_improvements": "85% reduction in indoor air pollution",
                "fuel_savings": "60% less wood needed"
            }
        ),
        CarbonProject(
            name="Mangrove Restoration",
            type="Forest Protection",
            location="Indonesia",
            price_per_credit=22.0,
            available_credits=30000,
            description="Restoring coastal mangrove forests to protect against climate change",
            verified=True,
            impact_metrics={
                "hectares_restored": 5000,
                "carbon_sequestered": "50 tons CO2/hectare/year",
                "coastal_protection": "100km of coastline"
            }
        ),
        CarbonProject(
            name="Solar Panel Installation",
            type="Renewable Energy",
            location="India",
            price_per_credit=16.0,
            available_credits=40000,
            description="Large-scale solar installations in rural communities",
            verified=True,
            impact_metrics={
                "solar_capacity": "200 MW",
                "rural_electrification": "50,000 homes",
                "jobs_created": 2500
            }
        )
    ]
    
    for project in projects:
        try:
            await db_manager.create_project(project)
            print(f"✅ Created project: {project.name}")
        except Exception as e:
            print(f"❌ Error creating project {project.name}: {e}")


async def seed_eco_products():
    """Seed eco-friendly products"""
    products = [
        EcoProduct(
            name="Bamboo Phone Case",
            brand="EcoTech Accessories",
            price=29.99,
            category="Electronics",
            description="100% biodegradable bamboo phone case with organic coating",
            carbon_footprint=0.8,
            sustainability_score=92,
            image_emoji="📱"
        ),
        EcoProduct(
            name="Organic Cotton T-Shirt",
            brand="Pure Threads",
            price=35.00,
            category="Fashion",
            description="GOTS certified organic cotton, fair trade manufacturing",
            carbon_footprint=2.1,
            sustainability_score=88,
            image_emoji="👕"
        ),
        EcoProduct(
            name="Solar Power Bank",
            brand="SunCharge",
            price=89.99,
            category="Electronics",
            description="Portable solar charger with recycled aluminum housing",
            carbon_footprint=5.2,
            sustainability_score=85,
            image_emoji="🔋"
        ),
        EcoProduct(
            name="Reusable Water Bottle",
            brand="HydroGreen",
            price=24.99,
            category="Lifestyle",
            description="Stainless steel bottle with lifetime warranty",
            carbon_footprint=1.5,
            sustainability_score=95,
            image_emoji="🍃"
        ),
        EcoProduct(
            name="Recycled Laptop Stand",
            brand="Eco Office",
            price=49.99,
            category="Electronics",
            description="Made from 100% recycled aluminum and plastic",
            carbon_footprint=3.2,
            sustainability_score=90,
            image_emoji="💻"
        ),
        EcoProduct(
            name="Hemp Sneakers",
            brand="Green Steps",
            price=120.00,
            category="Fashion",
            description="Sustainable sneakers made from hemp and organic cotton",
            carbon_footprint=4.5,
            sustainability_score=87,
            image_emoji="👟"
        ),
        EcoProduct(
            name="Biodegradable Phone Cleaner",
            brand="Clean Tech",
            price=12.99,
            category="Electronics",
            description="Plant-based screen cleaner in compostable packaging",
            carbon_footprint=0.3,
            sustainability_score=96,
            image_emoji="🧽"
        ),
        EcoProduct(
            name="Organic Wool Blanket",
            brand="Cozy Earth",
            price=89.99,
            category="Home & Garden",
            description="Ethically sourced wool from organic farms",
            carbon_footprint=6.8,
            sustainability_score=89,
            image_emoji="🏠"
        )
    ]
    
    for product in products:
        try:
            await db_manager.create_product(product)
            print(f"✅ Created product: {product.name}")
        except Exception as e:
            print(f"❌ Error creating product {product.name}: {e}")


async def main():
    """Main seeding function"""
    print("🌱 Starting database seeding...")
    
    print("\n📊 Seeding carbon projects...")
    await seed_carbon_projects()
    
    print("\n🛍️ Seeding eco products...")
    await seed_eco_products()
    
    print("\n✅ Database seeding completed!")


if __name__ == "__main__":
    asyncio.run(main())