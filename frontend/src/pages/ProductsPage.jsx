import React, { useState, useEffect } from 'react';
import { Search, Filter, Leaf, Star, ShoppingBag, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { productsAPI } from '../api/client';
import { toast } from 'sonner';

export const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('sustainability');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Fashion', label: 'Fashion' },
    { value: 'Lifestyle', label: 'Lifestyle' },
    { value: 'Home & Garden', label: 'Home & Garden' }
  ];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.getAll(selectedCategory);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load eco products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'sustainability':
          return b.sustainability_score - a.sustainability_score;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'carbon':
          return a.carbon_footprint - b.carbon_footprint;
        default:
          return 0;
      }
    });

  const addToWishlist = (product) => {
    toast.success(`Added ${product.name} to your wishlist!`);
  };

  const contactBrand = async (product) => {
    try {
      const response = await productsAPI.contact({
        product_id: product.id,
        business_email: 'your-business@company.com', // This would come from auth context
        message: 'I am interested in your sustainable product for our business.'
      });
      
      toast.success(`Message sent to ${product.brand}!`);
    } catch (error) {
      console.error('Error contacting brand:', error);
      toast.error('Failed to contact brand. Please try again.');
    }
  };

  const getSustainabilityColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getCarbonFootprintLevel = (footprint) => {
    if (footprint <= 2) return { level: 'Low', color: 'text-green-600' };
    if (footprint <= 5) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'High', color: 'text-orange-600' };
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container section-padding">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Leaf className="w-12 h-12" style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h1 className="heading-1 mb-4">Eco-Friendly Products</h1>
          <p className="body-large max-w-2xl mx-auto">
            Discover sustainable products from brands committed to environmental responsibility. 
            Connect with conscious consumers and grow your sustainable business.
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
                  Search Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search products or brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Category Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="heading-3 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Category
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <label key={category.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={selectedCategory === category.value}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-green-600"
                    />
                    <span className="body-medium">{category.label}</span>
                  </label>
                ))}
              </CardContent>
            </Card>

            {/* For Businesses */}
            <Card>
              <CardHeader>
                <CardTitle className="heading-3">🏢 For Businesses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="body-small">
                  Want to showcase your eco-friendly products to our community of conscious consumers?
                </p>
                <Button className="btn-primary w-full">
                  List Your Products
                </Button>
                <div className="space-y-2">
                  <div className="body-small">✓ Reach 50K+ eco-conscious users</div>
                  <div className="body-small">✓ Highlight sustainability features</div>
                  <div className="body-small">✓ Build brand trust & credibility</div>
                </div>
              </CardContent>
            </Card>

            {/* Sustainability Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="heading-3">📊 Sustainability Scoring</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="body-small">90-100: Excellent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="body-small">80-89: Very Good</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="body-small">70-79: Good</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <span className="body-small">Below 70: Fair</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="heading-2">{filteredProducts.length} Products Found</h2>
              <div className="flex items-center gap-2">
                <span className="body-small">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="body-small border border-gray-300 rounded px-2 py-1"
                >
                  <option value="sustainability">Sustainability Score</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="carbon">Carbon Footprint</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="body-medium">Loading eco products...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const carbonLevel = getCarbonFootprintLevel(product.carbon_footprint);
                return (
                  <Card key={product.id} className="product-card">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-4xl">{product.image}</div>
                        <div className="text-right">
                          <div className="heading-3" style={{ color: 'var(--accent-text)' }}>
                            ${product.price}
                          </div>
                        </div>
                      </div>
                      <CardTitle className="heading-3">{product.name}</CardTitle>
                      <CardDescription className="body-small">{product.brand}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="body-medium">{product.description}</p>
                      
                      {/* Sustainability Metrics */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="body-small">Sustainability Score:</span>
                          <Badge className={getSustainabilityColor(product.sustainabilityScore)}>
                            {product.sustainabilityScore}/100
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="body-small">Carbon Footprint:</span>
                          <span className={`body-small font-medium ${carbonLevel.color}`}>
                            {product.carbonFootprint} kg CO₂ ({carbonLevel.level})
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="body-small">Category:</span>
                          <Badge variant="outline">{product.category}</Badge>
                        </div>
                      </div>
                      
                      {/* Environmental Impact */}
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Leaf className="w-4 h-4 text-green-600" />
                          <span className="body-small font-semibold text-green-800">
                            Environmental Impact
                          </span>
                        </div>
                        <div className="body-small text-green-700">
                          This product saves {(5 - product.carbonFootprint).toFixed(1)} kg CO₂ 
                          compared to conventional alternatives
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Button 
                          onClick={() => contactBrand(product)}
                          className="btn-primary w-full"
                        >
                          Contact Brand
                        </Button>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => addToWishlist(product)}
                            variant="outline" 
                            className="btn-secondary flex-1"
                            size="sm"
                          >
                            Add to Wishlist
                          </Button>
                          <Button 
                            variant="outline" 
                            className="btn-secondary flex-1"
                            size="sm"
                          >
                            Share Product
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                <h3 className="heading-3 mb-2">No products found</h3>
                <p className="body-medium">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Business Partnership Section */}
        <div className="mt-16 pt-16 border-t">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Partner With Us</h2>
            <p className="body-large max-w-2xl mx-auto">
              Join our marketplace and connect your eco-friendly products with conscious consumers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8" style={{ color: 'var(--accent-text)' }} />
              </div>
              <h3 className="heading-3 mb-3">Gain Visibility</h3>
              <p className="body-medium">
                Showcase your products to 50,000+ environmentally conscious consumers actively seeking sustainable alternatives.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8" style={{ color: 'var(--accent-text)' }} />
              </div>
              <h3 className="heading-3 mb-3">Build Trust</h3>
              <p className="body-medium">
                Leverage our sustainability scoring system to highlight your environmental commitments and build customer trust.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" style={{ color: 'var(--accent-text)' }} />
              </div>
              <h3 className="heading-3 mb-3">Grow Sales</h3>
              <p className="body-medium">
                Connect directly with customers who prioritize sustainability, leading to higher conversion rates and customer loyalty.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button className="btn-primary">
              Start Selling Today
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};