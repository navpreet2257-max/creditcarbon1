import React, { useState } from 'react';
import { Calculator, Zap, Car, Building, Package, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';

export const CalculatorPage = () => {
  const [calculationResults, setCalculationResults] = useState(null);
  const [formData, setFormData] = useState({
    // Energy
    electricity: '',
    gas: '',
    renewablePercentage: '',
    
    // Transportation
    fleetVehicles: '',
    averageMiles: '',
    businessTravel: '',
    
    // Operations
    employees: '',
    officeSpace: '',
    dataCenter: false,
    manufacturing: false,
    
    // Supply Chain
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

  const calculateFootprint = () => {
    // Mock calculation logic
    const energyEmissions = (parseFloat(formData.electricity) || 0) * 0.4 + (parseFloat(formData.gas) || 0) * 5.3;
    const transportEmissions = (parseFloat(formData.fleetVehicles) || 0) * (parseFloat(formData.averageMiles) || 0) * 0.00044 + (parseFloat(formData.businessTravel) || 0) * 0.00019;
    const operationsEmissions = (parseFloat(formData.employees) || 0) * 2.5 + (parseFloat(formData.officeSpace) || 0) * 0.02;
    const supplyEmissions = (parseFloat(formData.suppliers) || 0) * 15 + (parseFloat(formData.shippingDistance) || 0) * 0.1;
    
    const totalEmissions = energyEmissions + transportEmissions + operationsEmissions + supplyEmissions;
    
    const breakdown = {
      energy: energyEmissions,
      transportation: transportEmissions,
      operations: operationsEmissions,
      supply: supplyEmissions,
      total: totalEmissions
    };

    setCalculationResults(breakdown);
    toast.success('Carbon footprint calculated successfully!');
  };

  const resetCalculator = () => {
    setFormData({
      electricity: '',
      gas: '',
      renewablePercentage: '',
      fleetVehicles: '',
      averageMiles: '',
      businessTravel: '',
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

  return (
    <div className="min-h-screen pt-20">
      <div className="container section-padding">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Calculator className="w-12 h-12" style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h1 className="heading-1 mb-4">Carbon Footprint Calculator</h1>
          <p className="body-large max-w-2xl mx-auto">
            Accurately measure your business's carbon emissions across all operations. 
            Get detailed insights to start your carbon neutrality journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="heading-2">Business Information</CardTitle>
                <CardDescription className="body-medium">
                  Provide details about your business operations to calculate your carbon footprint
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="energy" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="energy">Energy</TabsTrigger>
                    <TabsTrigger value="transport">Transport</TabsTrigger>
                    <TabsTrigger value="operations">Operations</TabsTrigger>
                    <TabsTrigger value="supply">Supply Chain</TabsTrigger>
                  </TabsList>

                  {/* Energy Tab */}
                  <TabsContent value="energy" className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                      <h3 className="heading-3">Energy Consumption</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="electricity">Monthly Electricity (kWh)</Label>
                        <Input
                          id="electricity"
                          type="number"
                          placeholder="e.g. 5000"
                          value={formData.electricity}
                          onChange={(e) => handleInputChange('electricity', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gas">Monthly Natural Gas (therms)</Label>
                        <Input
                          id="gas"
                          type="number"
                          placeholder="e.g. 250"
                          value={formData.gas}
                          onChange={(e) => handleInputChange('gas', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="renewable">Renewable Energy (%)</Label>
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
                  <TabsContent value="transport" className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Car className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                      <h3 className="heading-3">Transportation</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fleet">Fleet Vehicles</Label>
                        <Input
                          id="fleet"
                          type="number"
                          placeholder="e.g. 25"
                          value={formData.fleetVehicles}
                          onChange={(e) => handleInputChange('fleetVehicles', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="miles">Average Miles/Vehicle/Year</Label>
                        <Input
                          id="miles"
                          type="number"
                          placeholder="e.g. 15000"
                          value={formData.averageMiles}
                          onChange={(e) => handleInputChange('averageMiles', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="travel">Business Travel (miles/year)</Label>
                        <Input
                          id="travel"
                          type="number"
                          placeholder="e.g. 125000"
                          value={formData.businessTravel}
                          onChange={(e) => handleInputChange('businessTravel', e.target.value)}
                        />
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
                        <Label htmlFor="employees">Number of Employees</Label>
                        <Input
                          id="employees"
                          type="number"
                          placeholder="e.g. 150"
                          value={formData.employees}
                          onChange={(e) => handleInputChange('employees', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="office">Office Space (sq ft)</Label>
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
                        <Label htmlFor="suppliers">Number of Suppliers</Label>
                        <Input
                          id="suppliers"
                          type="number"
                          placeholder="e.g. 45"
                          value={formData.suppliers}
                          onChange={(e) => handleInputChange('suppliers', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shipping">Average Shipping Distance (miles)</Label>
                        <Input
                          id="shipping"
                          type="number"
                          placeholder="e.g. 2500"
                          value={formData.shippingDistance}
                          onChange={(e) => handleInputChange('shippingDistance', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="packaging">Packaging Type</Label>
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
                </Tabs>

                <div className="flex gap-4 mt-8">
                  <Button onClick={calculateFootprint} className="btn-primary flex-1">
                    Calculate Carbon Footprint
                  </Button>
                  <Button onClick={resetCalculator} variant="outline" className="btn-secondary">
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="heading-3">💡 Tips for Accuracy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="body-small">
                  • Use actual utility bills for energy data
                </div>
                <div className="body-small">
                  • Include all company vehicles and equipment
                </div>
                <div className="body-small">
                  • Consider remote employee emissions
                </div>
                <div className="body-small">
                  • Factor in seasonal variations
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {calculationResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="heading-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                    Your Carbon Footprint
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="heading-2" style={{ color: 'var(--accent-text)' }}>
                      {calculationResults.total.toFixed(1)}
                    </div>
                    <div className="body-small">tons CO₂ annually</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="body-medium">Energy:</span>
                      <span className="body-medium font-semibold">
                        {calculationResults.energy.toFixed(1)} tons
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="body-medium">Transportation:</span>
                      <span className="body-medium font-semibold">
                        {calculationResults.transportation.toFixed(1)} tons
                      </span>
                    </div>
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