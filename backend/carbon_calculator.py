from typing import Dict, List
from models import CarbonFootprintCreate


class CarbonCalculator:
    """
    Carbon footprint calculation logic for businesses
    """
    
    # Emission factors (in tons CO2 equivalent)
    ELECTRICITY_FACTOR = 0.0004  # per kWh
    GAS_FACTOR = 0.0053  # per therm
    VEHICLE_FACTOR = 0.00044  # per mile
    BUSINESS_TRAVEL_FACTOR = 0.00019  # per mile
    EMPLOYEE_FACTOR = 2.5  # per employee annually
    OFFICE_SPACE_FACTOR = 0.02  # per sq ft annually
    SUPPLIER_FACTOR = 15  # per supplier annually
    SHIPPING_FACTOR = 0.1  # per mile
    
    # Multipliers for different factors
    PACKAGING_MULTIPLIERS = {
        "recycled": 0.7,
        "mixed": 1.0,
        "conventional": 1.3
    }
    
    FACILITY_MULTIPLIERS = {
        "data_center": 2.5,
        "manufacturing": 3.0
    }

    @staticmethod
    def calculate_footprint(data: CarbonFootprintCreate) -> Dict:
        """
        Calculate carbon footprint based on business data
        Returns breakdown by category and total emissions
        """
        
        # Energy emissions
        electricity = float(data.energy_data.get("electricity", 0)) * 12  # Annual
        gas = float(data.energy_data.get("gas", 0)) * 12  # Annual
        renewable_pct = float(data.energy_data.get("renewablePercentage", 0)) / 100
        
        energy_emissions = (
            electricity * CarbonCalculator.ELECTRICITY_FACTOR * (1 - renewable_pct) +
            gas * CarbonCalculator.GAS_FACTOR
        )
        
        # Transportation emissions
        fleet_vehicles = float(data.transportation_data.get("fleetVehicles", 0))
        average_miles = float(data.transportation_data.get("averageMiles", 0))
        business_travel = float(data.transportation_data.get("businessTravel", 0))
        
        transportation_emissions = (
            fleet_vehicles * average_miles * CarbonCalculator.VEHICLE_FACTOR +
            business_travel * CarbonCalculator.BUSINESS_TRAVEL_FACTOR
        )
        
        # Operations emissions
        employees = float(data.operations_data.get("employees", 0))
        office_space = float(data.operations_data.get("officeSpace", 0))
        data_center = data.operations_data.get("dataCenter", False)
        manufacturing = data.operations_data.get("manufacturing", False)
        
        operations_emissions = (
            employees * CarbonCalculator.EMPLOYEE_FACTOR +
            office_space * CarbonCalculator.OFFICE_SPACE_FACTOR
        )
        
        # Apply facility multipliers
        if data_center:
            operations_emissions *= CarbonCalculator.FACILITY_MULTIPLIERS["data_center"]
        if manufacturing:
            operations_emissions *= CarbonCalculator.FACILITY_MULTIPLIERS["manufacturing"]
        
        # Supply chain emissions
        suppliers = float(data.supply_chain_data.get("suppliers", 0))
        shipping_distance = float(data.supply_chain_data.get("shippingDistance", 0))
        packaging_type = data.supply_chain_data.get("packaging", "mixed")
        
        supply_emissions = (
            suppliers * CarbonCalculator.SUPPLIER_FACTOR +
            shipping_distance * CarbonCalculator.SHIPPING_FACTOR
        ) * CarbonCalculator.PACKAGING_MULTIPLIERS.get(packaging_type, 1.0)
        
        # Total emissions
        total_emissions = (
            energy_emissions + 
            transportation_emissions + 
            operations_emissions + 
            supply_emissions
        )
        
        # Breakdown by category
        breakdown = {
            "energy": round(energy_emissions, 2),
            "transportation": round(transportation_emissions, 2),
            "operations": round(operations_emissions, 2),
            "supply_chain": round(supply_emissions, 2)
        }
        
        return {
            "total_emissions": round(total_emissions, 2),
            "breakdown": breakdown,
            "recommendations": CarbonCalculator._generate_recommendations(breakdown, data),
            "offset_cost_estimate": round(total_emissions * 20, 2)  # $20 per ton average
        }
    
    @staticmethod
    def _generate_recommendations(breakdown: Dict, data: CarbonFootprintCreate) -> List[str]:
        """Generate personalized recommendations based on calculation"""
        recommendations = []
        
        # Energy recommendations
        if breakdown["energy"] > breakdown["total"] * 0.3:  # High energy usage
            renewable_pct = float(data.energy_data.get("renewablePercentage", 0))
            if renewable_pct < 50:
                recommendations.append("Consider switching to renewable energy sources")
            recommendations.append("Implement energy efficiency measures in your facilities")
        
        # Transportation recommendations  
        if breakdown["transportation"] > breakdown["total"] * 0.3:
            recommendations.append("Consider electric or hybrid vehicles for your fleet")
            recommendations.append("Implement remote work policies to reduce business travel")
        
        # Operations recommendations
        if breakdown["operations"] > breakdown["total"] * 0.25:
            recommendations.append("Optimize office space usage and implement green building practices")
            if data.operations_data.get("dataCenter"):
                recommendations.append("Consider cloud migration to reduce data center emissions")
        
        # Supply chain recommendations
        if breakdown["supply_chain"] > breakdown["total"] * 0.2:
            recommendations.append("Work with local suppliers to reduce shipping distances")
            recommendations.append("Switch to sustainable packaging materials")
        
        # General recommendations
        recommendations.append("Purchase verified carbon credits to offset remaining emissions")
        recommendations.append("Set science-based targets for emission reduction")
        
        return recommendations


def calculate_carbon_footprint(data: CarbonFootprintCreate) -> Dict:
    """Main function to calculate carbon footprint"""
    return CarbonCalculator.calculate_footprint(data)