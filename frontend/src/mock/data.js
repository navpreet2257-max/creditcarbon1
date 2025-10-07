// Mock data for Carbon Credit Platform

export const mockBusinesses = [
  {
    id: 1,
    name: "EcoTech Solutions",
    industry: "Technology",
    carbonFootprint: 1250,
    offsetCredits: 1300,
    status: "Carbon Neutral",
    joinDate: "2024-01-15",
    logo: "🏢"
  },
  {
    id: 2,
    name: "Green Manufacturing Co",
    industry: "Manufacturing",
    carbonFootprint: 5670,
    offsetCredits: 4200,
    status: "Offsetting in Progress",
    joinDate: "2024-02-20",
    logo: "🏭"
  },
  {
    id: 3,
    name: "Sustainable Retail Ltd",
    industry: "Retail",
    carbonFootprint: 890,
    offsetCredits: 950,
    status: "Carbon Neutral",
    joinDate: "2024-03-10",
    logo: "🛍️"
  }
];

export const mockCarbonProjects = [
  {
    id: 1,
    name: "Amazon Rainforest Conservation",
    type: "Forest Protection",
    location: "Brazil",
    pricePerCredit: 25,
    availableCredits: 50000,
    verified: true,
    description: "Protecting 100,000 hectares of Amazon rainforest from deforestation",
    impactMetrics: {
      treesProtected: 2500000,
      biodiversitySpecies: 1200,
      communitiesSupported: 45
    }
  },
  {
    id: 2,
    name: "Wind Farm Development",
    type: "Renewable Energy",
    location: "Texas, USA",
    pricePerCredit: 18,
    availableCredits: 75000,
    verified: true,
    description: "Clean wind energy generation replacing fossil fuel power plants",
    impactMetrics: {
      mwCapacity: 500,
      householdsPowered: 150000,
      co2Reduced: "2.5M tons/year"
    }
  },
  {
    id: 3,
    name: "Clean Cookstoves Program",
    type: "Community Development",
    location: "Kenya",
    pricePerCredit: 12,
    availableCredits: 25000,
    verified: true,
    description: "Providing efficient cookstoves to reduce emissions and improve health",
    impactMetrics: {
      familiesBenefited: 15000,
      healthImprovements: "85% reduction in indoor air pollution",
      fuelSavings: "60% less wood needed"
    }
  }
];

export const mockEcoProducts = [
  {
    id: 1,
    name: "Bamboo Phone Case",
    brand: "EcoTech Accessories",
    price: 29.99,
    category: "Electronics",
    carbonFootprint: 0.8,
    sustainabilityScore: 92,
    description: "100% biodegradable bamboo phone case with organic coating",
    image: "📱"
  },
  {
    id: 2,
    name: "Organic Cotton T-Shirt",
    brand: "Pure Threads",
    price: 35.00,
    category: "Fashion",
    carbonFootprint: 2.1,
    sustainabilityScore: 88,
    description: "GOTS certified organic cotton, fair trade manufacturing",
    image: "👕"
  },
  {
    id: 3,
    name: "Solar Power Bank",
    brand: "SunCharge",
    price: 89.99,
    category: "Electronics",
    carbonFootprint: 5.2,
    sustainabilityScore: 85,
    description: "Portable solar charger with recycled aluminum housing",
    image: "🔋"
  },
  {
    id: 4,
    name: "Reusable Water Bottle",
    brand: "HydroGreen",
    price: 24.99,
    category: "Lifestyle",
    carbonFootprint: 1.5,
    sustainabilityScore: 95,
    description: "Stainless steel bottle with lifetime warranty",
    image: "🍃"
  }
];

export const mockFootprintCalculations = {
  energy: {
    electricity: 450, // kWh/month
    gas: 250, // therms/month
    renewable: 30 // % renewable
  },
  transportation: {
    fleetVehicles: 25,
    averageMiles: 15000, // per vehicle per year
    businessTravel: 125000 // miles per year
  },
  operations: {
    employees: 150,
    officeSpace: 25000, // sq ft
    dataCenter: true,
    manufacturing: false
  },
  supply: {
    suppliers: 45,
    shippingDistance: 2500, // average miles
    packaging: "mixed" // recycled, mixed, conventional
  }
};

export const mockDashboardData = {
  totalFootprint: 1250,
  offsetCredits: 1300,
  carbonNeutralDate: "2024-03-15",
  monthlyProgress: [
    { month: "Jan", footprint: 105, offset: 110 },
    { month: "Feb", footprint: 98, offset: 108 },
    { month: "Mar", footprint: 102, offset: 112 },
    { month: "Apr", footprint: 95, offset: 105 },
    { month: "May", footprint: 88, offset: 102 },
    { month: "Jun", footprint: 92, offset: 98 }
  ],
  projectsSupported: 8,
  certificatesEarned: 3,
  impactMetrics: {
    treesEquivalent: 2890,
    carsOffRoad: 45,
    homesAnnualEnergy: 78
  }
};

export const mockCertificates = [
  {
    id: "CERT-2024-001",
    businessName: "EcoTech Solutions",
    issueDate: "2024-06-15",
    validUntil: "2025-06-14",
    creditsOffset: 1300,
    status: "Active",
    type: "Carbon Neutral Certification"
  },
  {
    id: "CERT-2024-002",
    businessName: "EcoTech Solutions",
    issueDate: "2024-03-20",
    validUntil: "2024-06-19",
    creditsOffset: 850,
    status: "Expired",
    type: "Quarterly Offset Certificate"
  }
];

export const mockPaymentHistory = [
  {
    id: "PAY-001",
    date: "2024-06-01",
    amount: 3250.00,
    credits: 130,
    project: "Amazon Rainforest Conservation",
    status: "Completed"
  },
  {
    id: "PAY-002", 
    date: "2024-05-15",
    amount: 2160.00,
    credits: 120,
    project: "Wind Farm Development",
    status: "Completed"
  },
  {
    id: "PAY-003",
    date: "2024-04-28",
    amount: 1800.00,
    credits: 150,
    project: "Clean Cookstoves Program",
    status: "Completed"
  }
];