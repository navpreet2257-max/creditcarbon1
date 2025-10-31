import React, { useState } from 'react';
import { Calculator, Zap, Car, Building, Package, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { calculatorAPI } from '../api/client';

export const CalculatorPage = () => {
  const [calculationResults, setCalculationResults] = useState(null);
  const [userType, setUserType] = useState(null); // 'individual' or 'company'
  const [formData, setFormData] = useState({
    // Energy
    electricity: '',
    gas: '',
    renewablePercentage: '',

    // Transportation - Step 1: Vehicle Details
    vehicleType: 'car',
    monthlyDistance: '',
    fuelType: 'petrol',
    vehicleMileage: '',
    numberOfVehicles: '',

    // Transportation - Step 2: Sustainable Transport
    publicTransportKm: '',
    walkingCyclingKm: '',

    // Food & Diet (Individuals only)
    dietType: 'mixed',
    mealsPerDay: '',
    localFoodPercentage: '',

    // Travel & Aviation (Both)
    flightsPerYear: '',
    flightType: 'short',
    hotelNightsPerYear: '',

    // Operations (Companies only)
    employees: '',
    officeSpace: '',
    dataCenter: false,
    manufacturing: false,

    // Supply Chain (Companies only)
    suppliers: '',
    shippingDistance: '',
    packaging: 'mixed'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateFootprint = async () => {
    try {
      // Prepare calculation data
      const calculationData = {
        electricity: parseFloat(formData.electricity) || 0,
        gas: parseFloat(formData.gas) || 0,
        renewablePercentage: parseFloat(formData.renewablePercentage) || 0,
        fleetVehicles: parseFloat(formData.fleetVehicles) || 0,
        averageMiles: parseFloat(formData.averageMiles) || 0,
        businessTravel: parseFloat(formData.businessTravel) || 0,
        employees: parseFloat(formData.employees) || 0,
        officeSpace: parseFloat(formData.officeSpace) || 0,
        dataCenter: formData.dataCenter,
        manufacturing: formData.manufacturing,
        suppliers: parseFloat(formData.suppliers) || 0,
        shippingDistance: parseFloat(formData.shippingDistance) || 0,
        packaging: formData.packaging
      };

      // Try to call backend API first
      try {
        const response = await calculatorAPI.calculate(calculationData);

        if (response.data) {
          setCalculationResults(response.data);
          toast.success('Carbon footprint calculated successfully!');
          return;
        }
      } catch (apiError) {
        console.log('Backend API not available, using local calculation');
      }

      // Energy Emissions Calculation
      const electricityUsage = parseFloat(formData.electricity) || 0;
      const gasUsage = parseFloat(formData.gas) || 0;
      const renewablePercentage = parseFloat(formData.renewablePercentage) || 0;

      // Base emissions (kg CO2 per unit)
      const electricityEmissions = electricityUsage * 0.4; // kg CO2 per kWh
      const gasEmissions = gasUsage * 5.3; // kg CO2 per therm

      // Apply renewable energy reduction
      const renewableReduction = (renewablePercentage / 100) * electricityEmissions;
      const energyEmissions = (electricityEmissions + gasEmissions - renewableReduction) / 1000; // Convert kg to tons

      // Transportation Emissions Calculation (2-Step Process)
      let transportEmissions = 0;
      let step1Emissions = 0;
      let sustainableTransportSavings = 0;

      // Step 1: Calculate vehicle emissions
      const vehicleType = formData.vehicleType;
      const monthlyDistance = parseFloat(formData.monthlyDistance) || 0;
      const fuelType = formData.fuelType;
      const vehicleMileage = parseFloat(formData.vehicleMileage) || 0;
      const numberOfVehicles = parseFloat(formData.numberOfVehicles) || 0;

      if (monthlyDistance > 0 && vehicleMileage > 0 && numberOfVehicles > 0) {
        // Calculate fuel consumption per month
        const monthlyFuelConsumption = (monthlyDistance * numberOfVehicles) / vehicleMileage;

        // Base emission factors (kg CO2 per litre/kWh)
        let emissionFactor = 0;
        switch (fuelType) {
          case 'petrol':
            emissionFactor = 2.31; // kg CO2 per litre
            break;
          case 'diesel':
            emissionFactor = 2.68; // kg CO2 per litre
            break;
          case 'electric':
            emissionFactor = 0.5; // kg CO2 per kWh (electricity generation)
            break;
          case 'hybrid':
            emissionFactor = 1.5; // kg CO2 per litre (average for hybrids)
            break;
          default:
            emissionFactor = 2.31;
        }

        // Vehicle type multiplier
        let vehicleMultiplier = 1;
        switch (vehicleType) {
          case 'car':
            vehicleMultiplier = 1;
            break;
          case 'light':
            vehicleMultiplier = 1.5; // Vans/pickups are larger
            break;
          case 'heavy':
            vehicleMultiplier = 3; // Trucks/buses are much larger
            break;
          default:
            vehicleMultiplier = 1;
        }

        // Calculate monthly vehicle emissions (kg CO2)
        const monthlyVehicleEmissions = monthlyFuelConsumption * emissionFactor * vehicleMultiplier;

        // Convert to annual (kg CO2) and then to tons
        step1Emissions = (monthlyVehicleEmissions * 12) / 1000; // Convert kg to tons
        transportEmissions = step1Emissions;
      }

      // Step 2: Apply sustainable transport reduction
      const publicTransportKm = parseFloat(formData.publicTransportKm) || 0;
      const walkingCyclingKm = parseFloat(formData.walkingCyclingKm) || 0;

      if (publicTransportKm > 0 || walkingCyclingKm > 0) {
        // Public transport reduces emissions by ~80% compared to personal vehicles
        const publicTransportReduction = (publicTransportKm * 0.08) / 1000; // 8% of distance in tons

        // Walking/cycling produces zero emissions (reduces by 100% of that distance)
        const walkingCyclingReduction = (walkingCyclingKm * 0.12) / 1000; // 12% of distance in tons

        sustainableTransportSavings = publicTransportReduction + walkingCyclingReduction;
        transportEmissions = Math.max(0, transportEmissions - sustainableTransportSavings);
      }

      // Food & Diet Emissions Calculation (Individuals only)
      let foodEmissions = 0;
      if (userType === 'individual') {
        const dietType = formData.dietType;
        const mealsPerDay = parseFloat(formData.mealsPerDay) || 0;
        const localFoodPercentage = parseFloat(formData.localFoodPercentage) || 0;

        // Base daily emissions by diet type (kg CO2 per day)
        let baseDailyEmissions = 0;
        switch (dietType) {
          case 'vegan':
            baseDailyEmissions = 1.5;
            break;
          case 'vegetarian':
            baseDailyEmissions = 1.7;
            break;
          case 'lowMeat':
            baseDailyEmissions = 2.0;
            break;
          case 'mediumMeat':
            baseDailyEmissions = 2.5;
            break;
          case 'highMeat':
            baseDailyEmissions = 3.3;
            break;
          case 'mixed':
          default:
            baseDailyEmissions = 2.5;
            break;
        }

        // Restaurant meals increase emissions by 50%
        const restaurantMultiplier = mealsPerDay > 0 ? (mealsPerDay / 21) * 0.5 + 1 : 1;

        // Local food reduces transport emissions by up to 30%
        const localFoodReduction = (localFoodPercentage / 100) * 0.3;

        const adjustedDailyEmissions = baseDailyEmissions * restaurantMultiplier * (1 - localFoodReduction);
        foodEmissions = (adjustedDailyEmissions * 365) / 1000; // Convert kg to tons per year
      }

      // Travel & Aviation Emissions Calculation (Both types)
      let travelEmissions = 0;
      const flightsPerYear = parseFloat(formData.flightsPerYear) || 0;
      const flightType = formData.flightType;
      const hotelNightsPerYear = parseFloat(formData.hotelNightsPerYear) || 0;

      if (flightsPerYear > 0) {
        // Base emissions per flight type (tons CO2 per flight)
        let emissionsPerFlight = 0;
        switch (flightType) {
          case 'short':
            emissionsPerFlight = 0.25;
            break;
          case 'medium':
            emissionsPerFlight = 0.5;
            break;
          case 'long':
            emissionsPerFlight = 1.0;
            break;
          default:
            emissionsPerFlight = 0.4;
        }

        travelEmissions += flightsPerYear * emissionsPerFlight;
      }

      // Hotel stays (assume 0.02 tons CO2 per night average)
      if (hotelNightsPerYear > 0) {
        travelEmissions += hotelNightsPerYear * 0.02;
      }

      // Operations Emissions Calculation (Companies only)
      let operationsEmissions = 0;
      if (userType === 'company') {
        const employees = parseFloat(formData.employees) || 0;
        const officeSpace = parseFloat(formData.officeSpace) || 0;
        const hasDataCenter = formData.dataCenter;
        const hasManufacturing = formData.manufacturing;

        // Base operations emissions
        operationsEmissions = (employees * 2.5) + (officeSpace * 0.02);

        // Additional facilities impact
        if (hasDataCenter) operationsEmissions += employees * 1.2; // Data centers increase per-employee emissions
        if (hasManufacturing) operationsEmissions += officeSpace * 0.05; // Manufacturing adds significant emissions

        operationsEmissions = Math.max(0, operationsEmissions);
      }

      // Supply Chain Emissions Calculation (Companies only)
      let supplyEmissions = 0;
      if (userType === 'company') {
        const suppliers = parseFloat(formData.suppliers) || 0;
        const shippingDistance = parseFloat(formData.shippingDistance) || 0;
        const packagingType = formData.packaging;

        // Base supply chain emissions
        supplyEmissions = (suppliers * 15) + (shippingDistance * 0.1);

        // Packaging type multiplier
        let packagingMultiplier = 1;
        switch (packagingType) {
          case 'recycled':
            packagingMultiplier = 0.7; // 30% reduction for recycled
            break;
          case 'mixed':
            packagingMultiplier = 0.85; // 15% reduction for mixed
            break;
          case 'conventional':
          default:
            packagingMultiplier = 1; // No reduction
            break;
        }

        supplyEmissions = supplyEmissions * packagingMultiplier;
      }

      const totalEmissions = energyEmissions + transportEmissions + foodEmissions + travelEmissions + operationsEmissions + supplyEmissions;

      const breakdown = {
        energy: energyEmissions,
        transportation: transportEmissions,
        food: foodEmissions,
        travel: travelEmissions,
        operations: operationsEmissions,
        supply: supplyEmissions,
        total: totalEmissions
      };

      setCalculationResults(breakdown);
      toast.success('Carbon footprint calculated successfully!');
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error('Error calculating carbon footprint');
    }
  };

  const resetCalculator = () => {
    setFormData({
      electricity: '',
      gas: '',
      renewablePercentage: '',
      vehicleType: 'car',
      monthlyDistance: '',
      fuelType: 'petrol',
      vehicleMileage: '',
      numberOfVehicles: '',
      publicTransportKm: '',
      walkingCyclingKm: '',
      employees: '',
      officeSpace: '',
      dataCenter: false,
      manufacturing: false,
      suppliers: '',
      shippingDistance: '',
      packaging: 'mixed'
    });
    setCalculationResults(null);
    toast.info('Calculator reset');
  };

  // If user type not selected, show selection screen
  if (!userType) {
    return (
      <div className="min-h-screen pt-20" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">

            {/* Header */}
            <div className="mb-16">
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl animate-float">
                  <Calculator className="w-12 h-12 text-green-600" />
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white animate-fade-in">
                Carbon Footprint Calculator
              </h1>

              <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto animate-slide-up animation-delay-200">
                Choose your profile type to get started
              </p>
            </div>

            {/* Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

              {/* Individual Card */}
              <div
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl cursor-pointer hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 animate-slide-in-left"
                onClick={() => setUserType('individual')}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Individual</h3>
                  <p className="text-gray-600 mb-6">
                    Personal carbon footprint tracking
                  </p>

                  <div className="space-y-2 text-sm text-gray-500 mb-6">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Home Energy</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Transportation</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Food & Travel</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Card */}
              <div
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl cursor-pointer hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 animate-slide-in-right"
                onClick={() => setUserType('company')}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Company</h3>
                  <p className="text-gray-600 mb-6">
                    Business sustainability metrics
                  </p>

                  <div className="space-y-2 text-sm text-gray-500 mb-6">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Operations</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Supply Chain</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Employee Impact</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Text */}
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 inline-block animate-fade-in animation-delay-600">
              <p className="text-white font-medium">
                💡 Choose Individual for personal use or Company for business tracking
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg animate-float">
              <Calculator className="w-8 h-8 text-green-600" />
            </div>
            <div className="w-px h-16 bg-gray-300"></div>
            <div className="flex items-center gap-3">
              {userType === 'individual' ? (
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">👤</span>
                </div>
              ) : (
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
              )}
              <span className="text-2xl font-bold text-gray-800">
                {userType === 'individual' ? 'Personal' : 'Business'} Calculator
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 animate-slide-up animation-delay-200">
            {userType === 'individual' ? 'Personal Carbon Footprint' : 'Business Carbon Footprint'}
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-400">
            {userType === 'individual'
              ? 'Calculate your personal environmental impact and discover ways to reduce your carbon footprint.'
              : 'Accurately measure your business\'s carbon emissions across all operations and supply chain.'
            }
          </p>

          <Button
            onClick={() => setUserType(null)}
            variant="outline"
            className="mt-6 px-6 py-3 border-2 border-gray-300 hover:border-green-400 hover:bg-green-50 transition-all duration-300 animate-fade-in animation-delay-600"
          >
            ← Change Profile Type
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 animate-fade-in animation-delay-200">
          {/* Calculator Form */}
          <div className="lg:col-span-2 order-2 lg:order-1 animate-slide-in-left animation-delay-400">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="heading-2 flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  {userType === 'individual' ? 'Personal Information' : 'Business Information'}
                </CardTitle>
                <CardDescription className="body-medium text-gray-600">
                  Provide details about your {userType === 'individual' ? 'lifestyle' : 'operations'} to calculate your carbon footprint
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="energy" className="w-full">
                  <TabsList className={`grid w-full h-auto ${userType === 'individual' ? 'grid-cols-2' : 'grid-cols-3 sm:grid-cols-5'}`}>
                    <TabsTrigger value="energy" className="text-xs sm:text-sm">Energy</TabsTrigger>
                    <TabsTrigger value="transport" className="text-xs sm:text-sm">Transport</TabsTrigger>
                    {userType === 'individual' && (
                      <>
                        <TabsTrigger value="food" className="text-xs sm:text-sm">Food & Diet</TabsTrigger>
                        <TabsTrigger value="travel" className="text-xs sm:text-sm">Travel</TabsTrigger>
                      </>
                    )}
                    {userType === 'company' && (
                      <>
                        <TabsTrigger value="operations" className="text-xs sm:text-sm">Operations</TabsTrigger>
                        <TabsTrigger value="supply" className="text-xs sm:text-sm">Supply Chain</TabsTrigger>
                        <TabsTrigger value="travel" className="text-xs sm:text-sm">Travel</TabsTrigger>
                      </>
                    )}
                  </TabsList>

                  {/* Energy Tab */}
                  <TabsContent value="energy" className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                      <h3 className="heading-3">Energy Consumption</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="electricity">Monthly Electricity (kWh)</Label>
                          <div className="group relative">
                            <span className="text-blue-500 cursor-help text-sm">ⓘ</span>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                              Check your electricity bill for exact kWh usage. This is usually the largest portion of home energy emissions.
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                          </div>
                        </div>
                        <Input
                          id="electricity"
                          type="number"
                          placeholder="e.g. 5000"
                          value={formData.electricity}
                          onChange={(e) => handleInputChange('electricity', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="gas">Monthly Natural Gas (therms)</Label>
                          <div className="group relative">
                            <span className="text-blue-500 cursor-help text-sm">ⓘ</span>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                              Natural gas for heating, cooking, and hot water. 1 therm = 100 cubic feet. Check your gas bill.
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                          </div>
                        </div>
                        <Input
                          id="gas"
                          type="number"
                          placeholder="e.g. 250"
                          value={formData.gas}
                          onChange={(e) => handleInputChange('gas', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="renewable">Renewable Energy (%)</Label>
                          <div className="group relative">
                            <span className="text-blue-500 cursor-help text-sm">ⓘ</span>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                              Solar panels, wind energy, or green energy programs. This reduces your electricity emissions significantly.
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                          </div>
                        </div>
                        <Input
                          id="renewable"
                          type="number"
                          placeholder="e.g. 30"
                          max="100"
                          value={formData.renewablePercentage}
                          onChange={(e) => handleInputChange('renewablePercentage', e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Transportation Tab */}
                  <TabsContent value="transport" className="space-y-8">
                    <div className="flex items-center gap-2 mb-6">
                      <Car className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                      <h3 className="heading-3">Transportation Emissions</h3>
                    </div>

                    {/* Step 1: Vehicle Details */}
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="heading-4 mb-2 flex items-center gap-2">
                          <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                          Vehicle Details
                        </h4>
                        <p className="body-small text-gray-600">Tell us about your vehicles to calculate monthly emissions</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="vehicleType">Vehicle Type</Label>
                            <div className="group relative">
                              <span className="text-blue-500 cursor-help text-sm">ⓘ</span>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                                Different vehicle sizes have different emission impacts. Heavy vehicles emit much more CO2 per km than cars.
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                              </div>
                            </div>
                          </div>
                          <select
                            id="vehicleType"
                            value={formData.vehicleType}
                            onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="car">Car</option>
                            <option value="light">Light Vehicle (Van/Pickup)</option>
                            <option value="heavy">Heavy Vehicle (Truck/Bus)</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="numberOfVehicles">Number of Vehicles</Label>
                            <div className="group relative">
                              <span className="text-blue-500 cursor-help text-sm">ⓘ</span>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                                Total fleet size. More vehicles = higher emissions. Consider carpooling or vehicle sharing to reduce this number.
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                              </div>
                            </div>
                          </div>
                          <Input
                            id="numberOfVehicles"
                            type="number"
                            placeholder="e.g. 5"
                            value={formData.numberOfVehicles}
                            onChange={(e) => handleInputChange('numberOfVehicles', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="monthlyDistance">Monthly Distance per Vehicle (km)</Label>
                            <div className="group relative">
                              <span className="text-blue-500 cursor-help text-sm">ⓘ</span>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                                Average kilometers each vehicle travels per month. Higher distance = higher emissions. Track this from odometer readings.
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                              </div>
                            </div>
                          </div>
                          <Input
                            id="monthlyDistance"
                            type="number"
                            placeholder="e.g. 2000"
                            value={formData.monthlyDistance}
                            onChange={(e) => handleInputChange('monthlyDistance', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="fuelType">Fuel Type</Label>
                            <div className="group relative">
                              <span className="text-blue-500 cursor-help text-sm">ⓘ</span>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                                Electric vehicles produce far fewer emissions than petrol or diesel. Consider switching to electric for lower carbon footprint.
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                              </div>
                            </div>
                          </div>
                          <select
                            id="fuelType"
                            value={formData.fuelType}
                            onChange={(e) => handleInputChange('fuelType', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="petrol">Petrol</option>
                            <option value="diesel">Diesel</option>
                            <option value="electric">Electric</option>
                            <option value="hybrid">Hybrid</option>
                          </select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="vehicleMileage">Vehicle Mileage (km/litre or km/kWh)</Label>
                            <div className="group relative">
                              <span className="text-blue-500 cursor-help text-sm">ⓘ</span>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                                Fuel efficiency rating. Higher mileage = lower emissions. Check your vehicle's specifications or use online tools.
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                              </div>
                            </div>
                          </div>
                          <Input
                            id="vehicleMileage"
                            type="number"
                            step="0.1"
                            placeholder="e.g. 15 (km/litre) or 5 (km/kWh)"
                            value={formData.vehicleMileage}
                            onChange={(e) => handleInputChange('vehicleMileage', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Sustainable Transport */}
                    <div className="space-y-6">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="heading-4 mb-2 flex items-center gap-2">
                          <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                          Sustainable Transport
                        </h4>
                        <p className="body-small text-gray-600">Reduce your emissions with public transport, walking, and cycling</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="publicTransportKm">Monthly Public Transport (km)</Label>
                          <Input
                            id="publicTransportKm"
                            type="number"
                            placeholder="e.g. 500"
                            value={formData.publicTransportKm}
                            onChange={(e) => handleInputChange('publicTransportKm', e.target.value)}
                          />
                          <p className="body-small text-gray-500">Bus, train, metro, etc.</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="walkingCyclingKm">Monthly Walking/Cycling (km)</Label>
                          <Input
                            id="walkingCyclingKm"
                            type="number"
                            placeholder="e.g. 200"
                            value={formData.walkingCyclingKm}
                            onChange={(e) => handleInputChange('walkingCyclingKm', e.target.value)}
                          />
                          <p className="body-small text-gray-500">Walking, cycling, or other zero-emission transport</p>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h5 className="body-medium font-semibold mb-2">💡 Emission Reduction Tips:</h5>
                        <ul className="body-small space-y-1 text-gray-600">
                          <li>• Public transport reduces emissions by ~80% compared to cars</li>
                          <li>• Walking/cycling produces zero emissions</li>
                          <li>• Electric vehicles can reduce emissions by up to 70%</li>
                          <li>• Carpooling and route optimization help reduce overall distance</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Operations Tab */}
                  <TabsContent value="operations" className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Building className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                      <h3 className="heading-3">Business Operations</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="employees">Number of Employees</Label>
                          <div className="group relative">
                            <span className="text-blue-500 cursor-help text-sm">ⓘ</span>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                              Full-time equivalent employees. Each employee contributes to business operations emissions through commuting, equipment use, etc.
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                          </div>
                        </div>
                        <Input
                          id="employees"
                          type="number"
                          placeholder="e.g. 150"
                          value={formData.employees}
                          onChange={(e) => handleInputChange('employees', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="office">Office Space (sq ft)</Label>
                          <div className="group relative">
                            <span className="text-blue-500 cursor-help text-sm">ⓘ</span>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                              Total office floor space. Larger spaces require more heating, cooling, and lighting energy.
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                          </div>
                        </div>
                        <Input
                          id="office"
                          type="number"
                          placeholder="e.g. 25000"
                          value={formData.officeSpace}
                          onChange={(e) => handleInputChange('officeSpace', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <Label>Additional Facilities</Label>
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.dataCenter}
                            onChange={(e) => handleInputChange('dataCenter', e.target.checked)}
                            className="rounded"
                          />
                          <span className="body-medium">Data Center</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.manufacturing}
                            onChange={(e) => handleInputChange('manufacturing', e.target.checked)}
                            className="rounded"
                          />
                          <span className="body-medium">Manufacturing Facility</span>
                        </label>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Supply Chain Tab */}
                  <TabsContent value="supply" className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                      <h3 className="heading-3">Supply Chain</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="suppliers">Number of Suppliers</Label>
                          <div className="group relative">
                            <span className="text-blue-500 cursor-help text-sm">ⓘ</span>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                              Total number of suppliers in your supply chain. More suppliers typically means higher supply chain emissions.
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                          </div>
                        </div>
                        <Input
                          id="suppliers"
                          type="number"
                          placeholder="e.g. 45"
                          value={formData.suppliers}
                          onChange={(e) => handleInputChange('suppliers', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="shipping">Average Shipping Distance (miles)</Label>
                          <div className="group relative">
                            <span className="text-blue-500 cursor-help text-sm">ⓘ</span>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                              Average distance goods travel from suppliers. Longer distances = higher transportation emissions.
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                          </div>
                        </div>
                        <Input
                          id="shipping"
                          type="number"
                          placeholder="e.g. 2500"
                          value={formData.shippingDistance}
                          onChange={(e) => handleInputChange('shippingDistance', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="packaging">Packaging Type</Label>
                          <div className="group relative">
                            <span className="text-blue-500 cursor-help text-sm">ⓘ</span>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                              Recycled materials significantly reduce packaging emissions. Consider switching to sustainable packaging options.
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                          </div>
                        </div>
                        <select
                          id="packaging"
                          value={formData.packaging}
                          onChange={(e) => handleInputChange('packaging', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="recycled">Recycled Materials</option>
                          <option value="mixed">Mixed Materials</option>
                          <option value="conventional">Conventional Materials</option>
                        </select>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Food & Diet Tab (Individuals only) */}
                  <TabsContent value="food" className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">🥗</span>
                      <h3 className="heading-3">Food & Diet</h3>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg mb-6">
                      <h4 className="heading-4 mb-2">Diet Type Impact</h4>
                      <p className="body-small text-gray-600 mb-3">
                        Different diets have significantly different carbon footprints. Animal products typically have higher emissions than plant-based foods.
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white p-2 rounded">🥩 High Meat: 3.3 kg CO₂/day</div>
                        <div className="bg-white p-2 rounded">🥛 Medium Meat: 2.5 kg CO₂/day</div>
                        <div className="bg-white p-2 rounded">🥕 Low Meat: 1.7 kg CO₂/day</div>
                        <div className="bg-white p-2 rounded">🌱 Vegetarian: 1.5 kg CO₂/day</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="dietType">Primary Diet Type</Label>
                          <div className="group relative">
                            <span className="text-blue-500 cursor-help text-sm">ⓘ</span>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                              Your main eating pattern. Plant-based diets have significantly lower carbon footprints than meat-heavy diets.
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                          </div>
                        </div>
                        <select
                          id="dietType"
                          value={formData.dietType}
                          onChange={(e) => handleInputChange('dietType', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="vegan">Vegan (Plant-based only)</option>
                          <option value="vegetarian">Vegetarian (No meat, includes dairy/eggs)</option>
                          <option value="lowMeat">Low Meat (1-2 servings/week)</option>
                          <option value="mediumMeat">Medium Meat (3-5 servings/week)</option>
                          <option value="highMeat">High Meat (Daily meat consumption)</option>
                          <option value="mixed">Mixed (Varied diet)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="mealsPerDay">Meals Eaten Out per Week</Label>
                          <div className="group relative">
                            <span className="text-blue-500 cursor-help text-sm">ⓘ</span>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                              Restaurant meals typically use more energy and resources than home cooking. Track meals eaten outside your home.
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                          </div>
                        </div>
                        <Input
                          id="mealsPerDay"
                          type="number"
                          placeholder="e.g. 5"
                          max="21"
                          value={formData.mealsPerDay}
                          onChange={(e) => handleInputChange('mealsPerDay', e.target.value)}
                        />
                        <p className="body-small text-gray-500">Restaurant meals typically have higher emissions</p>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="localFoodPercentage">Local/Seasonal Food (%)</Label>
                          <div className="group relative">
                            <span className="text-blue-500 cursor-help text-sm">ⓘ</span>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                              Food grown locally and in season requires less transportation and refrigeration, reducing its carbon footprint.
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                          </div>
                        </div>
                        <Input
                          id="localFoodPercentage"
                          type="number"
                          placeholder="e.g. 60"
                          max="100"
                          value={formData.localFoodPercentage}
                          onChange={(e) => handleInputChange('localFoodPercentage', e.target.value)}
                        />
                        <p className="body-small text-gray-500">Local and seasonal food reduces transportation emissions</p>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="body-medium font-semibold mb-2">🌱 Diet Emission Reduction Tips:</h5>
                      <ul className="body-small space-y-1 text-gray-600">
                        <li>• Plant-based meals can reduce food emissions by up to 75%</li>
                        <li>• Choose local and seasonal produce to minimize transport</li>
                        <li>• Reduce food waste - plan meals and use leftovers</li>
                        <li>• Eat out less frequently - home cooking is more efficient</li>
                      </ul>
                    </div>
                  </TabsContent>

                  {/* Travel & Aviation Tab (Both Individual and Company) */}
                  <TabsContent value="travel" className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">✈️</span>
                      <h3 className="heading-3">Travel & Aviation</h3>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                      <h4 className="heading-4 mb-2">Flight Emission Facts</h4>
                      <p className="body-small text-gray-600 mb-3">
                        Air travel is one of the most carbon-intensive activities. A single long-haul flight can equal months of driving emissions.
                      </p>
                      <div className="grid grid-cols-1 gap-2 text-xs">
                        <div className="bg-white p-2 rounded">🛫 Short Flight (1-3 hours): 0.25 tons CO₂</div>
                        <div className="bg-white p-2 rounded">🛬 Medium Flight (3-6 hours): 0.5 tons CO₂</div>
                        <div className="bg-white p-2 rounded">🛩️ Long Flight (6+ hours): 1.0+ tons CO₂</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="flightsPerYear">Flights per Year</Label>
                        <Input
                          id="flightsPerYear"
                          type="number"
                          placeholder="e.g. 4"
                          value={formData.flightsPerYear}
                          onChange={(e) => handleInputChange('flightsPerYear', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="flightType">Typical Flight Duration</Label>
                        <select
                          id="flightType"
                          value={formData.flightType}
                          onChange={(e) => handleInputChange('flightType', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="short">Short (1-3 hours)</option>
                          <option value="medium">Medium (3-6 hours)</option>
                          <option value="long">Long (6+ hours)</option>
                        </select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="hotelNightsPerYear">Hotel Nights per Year</Label>
                        <Input
                          id="hotelNightsPerYear"
                          type="number"
                          placeholder="e.g. 20"
                          value={formData.hotelNightsPerYear}
                          onChange={(e) => handleInputChange('hotelNightsPerYear', e.target.value)}
                        />
                        <p className="body-small text-gray-500">Hotel stays contribute to tourism industry emissions</p>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="body-medium font-semibold mb-2">✈️ Travel Emission Reduction Tips:</h5>
                      <ul className="body-small space-y-1 text-gray-600">
                        <li>• Consider train travel instead of flying for shorter distances</li>
                        <li>• Combine multiple meetings into single trips</li>
                        <li>• Use video conferencing to replace some travel</li>
                        <li>• Choose direct flights when possible to reduce emissions</li>
                        <li>• Consider carbon offset programs for unavoidable flights</li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
                  <Button onClick={calculateFootprint} className="liquid-button w-full sm:flex-1 text-lg py-4 animate-glow-pulse hover:animate-none">
                    <span className="relative z-10">Calculate Carbon Footprint</span>
                  </Button>
                  <Button onClick={resetCalculator} variant="outline" className="btn-secondary w-full sm:w-auto py-4 border-2 hover:border-green-400 transition-all duration-300">
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">🔄</span>
                      Reset
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="space-y-4 lg:space-y-6 order-1 lg:order-2 animate-slide-in-right animation-delay-600">
            {/* Quick Tips */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 animate-fade-in animation-delay-800">
              <CardHeader className="pb-4">
                <CardTitle className="heading-3 flex items-center gap-2">
                  <span className="text-2xl animate-bounce">💡</span>
                  Tips for Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="body-small flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 animate-pulse"></div>
                  <span>Use actual utility bills for energy data</span>
                </div>
                <div className="body-small flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 animate-pulse"></div>
                  <span>Include all company vehicles and equipment</span>
                </div>
                <div className="body-small flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 animate-pulse"></div>
                  <span>Consider remote employee emissions</span>
                </div>
                <div className="body-small flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 animate-pulse"></div>
                  <span>Factor in seasonal variations</span>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {calculationResults && (
              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm animate-scale-in animation-delay-200">
                <CardHeader className="pb-6">
                  <CardTitle className="heading-2 flex items-center gap-3">
                    <div className="relative">
                      <TrendingUp className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                    </div>
                    Your Carbon Footprint Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Main Result */}
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 animate-pulse">
                    <div className="text-sm text-green-600 mb-2 font-medium">Total Annual Emissions</div>
                    <div className="heading-1 mb-2" style={{ color: 'var(--accent-text)' }}>
                      {calculationResults.total.toFixed(1)}
                    </div>
                    <div className="body-medium text-gray-600">tons CO₂ annually</div>
                    <div className="mt-3 text-xs text-gray-500">
                      {calculationResults.total < 5 ? '🌱 Excellent! Very low footprint' :
                       calculationResults.total < 15 ? '👍 Good! Below average' :
                       calculationResults.total < 25 ? '⚠️ Moderate - room for improvement' :
                       '🔴 High - significant reduction needed'}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="body-medium">Energy:</span>
                      <span className="body-medium font-semibold">
                        {calculationResults.energy.toFixed(1)} tons
                      </span>
                    </div>

                    {/* Transportation Breakdown */}
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="body-medium">Transportation:</span>
                        <span className="body-medium font-semibold">
                          {calculationResults.transportation.toFixed(1)} tons
                        </span>
                      </div>

                      {/* Show detailed transportation breakdown if we have vehicle data */}
                      {(parseFloat(formData.monthlyDistance) > 0 && parseFloat(formData.vehicleMileage) > 0 && parseFloat(formData.numberOfVehicles) > 0) && (
                        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                          <div className="text-xs text-gray-600 font-medium">Transportation Breakdown:</div>

                          {/* Step 1 Emissions */}
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-600">Step 1 (Vehicle Emissions):</span>
                            <span className="font-medium">
                              {((calculationResults.transportation + (parseFloat(formData.publicTransportKm) || 0) * 0.08 / 1000 + (parseFloat(formData.walkingCyclingKm) || 0) * 0.12 / 1000) || 0).toFixed(1)} tons
                            </span>
                          </div>

                          {/* Sustainable Transport Savings */}
                          {((parseFloat(formData.publicTransportKm) || 0) > 0 || (parseFloat(formData.walkingCyclingKm) || 0) > 0) && (
                            <div className="flex justify-between text-sm">
                              <span className="text-green-600">Step 2 Savings:</span>
                              <span className="font-medium text-green-600">
                                -{(((parseFloat(formData.publicTransportKm) || 0) * 0.08 / 1000 + (parseFloat(formData.walkingCyclingKm) || 0) * 0.12 / 1000) || 0).toFixed(1)} tons
                              </span>
                            </div>
                          )}

                          {/* Public Transport Savings */}
                          {parseFloat(formData.publicTransportKm) > 0 && (
                            <div className="text-xs text-gray-500 ml-4">
                              • Public transport: -{((parseFloat(formData.publicTransportKm) * 0.08 / 1000) || 0).toFixed(1)} tons saved
                            </div>
                          )}

                          {/* Walking/Cycling Savings */}
                          {parseFloat(formData.walkingCyclingKm) > 0 && (
                            <div className="text-xs text-gray-500 ml-4">
                              • Walking/Cycling: -{((parseFloat(formData.walkingCyclingKm) * 0.12 / 1000) || 0).toFixed(1)} tons saved
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Food & Diet (Individuals only) */}
                    {userType === 'individual' && calculationResults.food > 0 && (
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="body-medium">🥗 Food & Diet:</span>
                          <span className="body-medium font-semibold">
                            {calculationResults.food.toFixed(1)} tons
                          </span>
                        </div>
                        <div className="bg-orange-50 p-2 rounded-lg">
                          <div className="text-xs text-gray-600 font-medium mb-1">Diet Breakdown:</div>
                          <div className="text-xs text-gray-500">
                            • Based on {formData.dietType} diet with {formData.mealsPerDay || 0} restaurant meals/week
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Travel & Aviation (Both types) */}
                    {calculationResults.travel > 0 && (
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="body-medium">✈️ Travel & Aviation:</span>
                          <span className="body-medium font-semibold">
                            {calculationResults.travel.toFixed(1)} tons
                          </span>
                        </div>
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <div className="text-xs text-gray-600 font-medium mb-1">Travel Breakdown:</div>
                          <div className="text-xs text-gray-500">
                            • {formData.flightsPerYear || 0} {formData.flightType} flights per year
                            {formData.hotelNightsPerYear > 0 && (
                              <span> + {formData.hotelNightsPerYear} hotel nights</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {userType === 'company' && (
                      <>
                        <div className="flex justify-between">
                          <span className="body-medium">Operations:</span>
                          <span className="body-medium font-semibold">
                            {calculationResults.operations.toFixed(1)} tons
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="body-medium">Supply Chain:</span>
                          <span className="body-medium font-semibold">
                            {calculationResults.supply.toFixed(1)} tons
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <Button className="btn-primary w-full">
                      Offset Your Emissions
                    </Button>
                    <p className="body-small text-center mt-2">
                      Estimated cost: ${(calculationResults.total * 20).toFixed(0)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Integration Options */}
            <Card>
              <CardHeader>
                <CardTitle className="heading-3">🔗 Integrate Your Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Connect Accounting System
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Link Energy Provider
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Import Fleet Data
                </Button>
                <p className="body-small">
                  Automate data collection for more accurate calculations
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
