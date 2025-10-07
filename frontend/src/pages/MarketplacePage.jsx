import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Award, TrendingUp, ShoppingCart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { projectsAPI, creditsAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const MarketplacePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [cart, setCart] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const projectTypes = [
    { value: 'all', label: 'All Projects' },
    { value: 'Forest Protection', label: 'Forest Protection' },
    { value: 'Renewable Energy', label: 'Renewable Energy' },
    { value: 'Community Development', label: 'Community Development' }
  ];

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsAPI.getAll(selectedType);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load carbon projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [selectedType]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const addToCart = (project, credits = 10) => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase credits');
      return;
    }

    const cartItem = {
      projectId: project.id,
      projectName: project.name,
      credits: credits,
      pricePerCredit: project.price_per_credit,
      total: credits * project.price_per_credit
    };

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.projectId === project.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.projectId === project.id
            ? { ...item, credits: item.credits + credits, total: (item.credits + credits) * item.pricePerCredit }
            : item
        );
      }
      return [...prevCart, cartItem];
    });

    toast.success(`Added ${credits} credits to cart from ${project.name}`);
  };

  const purchaseCredits = async (projectId, credits) => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase credits');
      return;
    }

    try {
      const response = await creditsAPI.purchase({
        project_id: projectId,
        credits: credits
      });
      
      toast.success(`Successfully purchased ${credits} carbon credits!`);
      
      // Update project availability
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.id === projectId
            ? { ...project, available_credits: project.available_credits - credits }
            : project
        )
      );
      
      // Remove from cart
      setCart(prevCart => prevCart.filter(item => item.projectId !== projectId));
      
    } catch (error) {
      console.error('Error purchasing credits:', error);
      const message = error.response?.data?.detail || 'Failed to purchase credits';
      toast.error(message);
    }
  };

  const getTotalCartValue = () => {
    return cart.reduce((total, item) => total + item.total, 0);
  };

  const getTotalCredits = () => {
    return cart.reduce((total, item) => total + item.credits, 0);
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container section-padding">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Award className="w-12 h-12" style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h1 className="heading-1 mb-4">Carbon Credit Marketplace</h1>
          <p className="body-large max-w-2xl mx-auto">
            Purchase high-quality, verified carbon credits from impactful projects worldwide. 
            Every credit supports verified environmental initiatives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="heading-3 flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Project Type Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="heading-3 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Project Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {projectTypes.map((type) => (
                  <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="projectType"
                      value={type.value}
                      checked={selectedType === type.value}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="text-green-600"
                    />
                    <span className="body-medium">{type.label}</span>
                  </label>
                ))}
              </CardContent>
            </Card>

            {/* Shopping Cart */}
            {cart.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="heading-3 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Your Cart
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div>
                          <div className="body-small font-medium">{item.projectName}</div>
                          <div className="body-small" style={{ color: 'var(--text-muted)' }}>
                            {item.credits} credits × ${item.pricePerCredit}
                          </div>
                        </div>
                        <div className="body-small font-semibold">
                          ${item.total.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="body-medium font-semibold">Total Credits:</span>
                      <span className="body-medium font-semibold">{getTotalCredits()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="body-medium font-semibold">Total Cost:</span>
                      <span className="body-medium font-semibold" style={{ color: 'var(--accent-text)' }}>
                        ${getTotalCartValue().toFixed(2)}
                      </span>
                    </div>
                    <Button className="btn-primary w-full">
                      Proceed to Checkout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="heading-3">💚 Impact Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="heading-3" style={{ color: 'var(--accent-text)' }}>2.5M+</div>
                  <div className="body-small">Tons CO₂ Offset</div>
                </div>
                <div className="text-center">
                  <div className="heading-3" style={{ color: 'var(--accent-text)' }}>45+</div>
                  <div className="body-small">Active Projects</div>
                </div>
                <div className="text-center">
                  <div className="heading-3" style={{ color: 'var(--accent-text)' }}>98%</div>
                  <div className="body-small">Verification Rate</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projects Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="heading-2">{filteredProjects.length} Projects Available</h2>
              <div className="flex items-center gap-2">
                <span className="body-small">Sort by:</span>
                <select className="body-small border border-gray-300 rounded px-2 py-1">
                  <option>Price (Low to High)</option>
                  <option>Price (High to Low)</option>
                  <option>Most Credits Available</option>
                  <option>Recently Added</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="product-card">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {project.type}
                      </Badge>
                      <div className="text-right">
                        <div className="heading-3" style={{ color: 'var(--accent-text)' }}>
                          ${project.pricePerCredit}
                        </div>
                        <div className="body-small">per credit</div>
                      </div>
                    </div>
                    <CardTitle className="heading-3">{project.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {project.location}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="body-medium">{project.description}</p>
                    
                    {/* Impact Metrics */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="body-medium font-semibold mb-2">Project Impact:</h4>
                      <div className="space-y-1">
                        {Object.entries(project.impactMetrics).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="body-small capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                            </span>
                            <span className="body-small font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Availability */}
                    <div className="flex justify-between items-center">
                      <span className="body-small">
                        {project.availableCredits.toLocaleString()} credits available
                      </span>
                      {project.verified && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          ✓ Verified
                        </Badge>
                      )}
                    </div>
                    
                    {/* Purchase Options */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => addToCart(project, 10)}
                          className="btn-secondary flex-1"
                          size="sm"
                        >
                          10 Credits (${(project.price_per_credit * 10).toFixed(0)})
                        </Button>
                        <Button 
                          onClick={() => addToCart(project, 50)}
                          className="btn-secondary flex-1"
                          size="sm"
                        >
                          50 Credits (${(project.price_per_credit * 50).toFixed(0)})
                        </Button>
                      </div>
                      <Button 
                        onClick={() => purchaseCredits(project.id, 100)}
                        className="btn-primary w-full"
                      >
                        Buy 100 Credits - ${(project.price_per_credit * 100).toFixed(0)}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                <h3 className="heading-3 mb-2">No projects found</h3>
                <p className="body-medium">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-16 pt-16 border-t">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">How Carbon Credits Work</h2>
            <p className="body-large max-w-2xl mx-auto">
              Every credit represents one ton of CO₂ removed or prevented from entering the atmosphere
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8" style={{ color: 'var(--accent-text)' }} />
              </div>
              <h3 className="heading-3 mb-3">1. Choose Projects</h3>
              <p className="body-medium">
                Select from verified environmental projects that align with your values and goals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8" style={{ color: 'var(--accent-text)' }} />
              </div>
              <h3 className="heading-3 mb-3">2. Purchase Credits</h3>
              <p className="body-medium">
                Buy the exact number of credits needed to offset your calculated carbon footprint.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" style={{ color: 'var(--accent-text)' }} />
              </div>
              <h3 className="heading-3 mb-3">3. Get Certified</h3>
              <p className="body-medium">
                Receive official documentation and certificates proving your carbon neutral status.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};