import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Calculator, Store, TrendingUp, Award, Users, Globe, ChevronDown } from 'lucide-react';
import { mockBusinesses, mockCarbonProjects } from '../mock/data';
import { scrollToElement } from '../lib/smoothScroll';

export const HomePage = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Check if there's a hash in the URL and scroll to that section
    if (location.hash) {
      const sectionId = location.hash.substring(1);
      setTimeout(() => {
        scrollToElement(sectionId, 80);
      }, 100);
    }
  }, [location]);

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    scrollToElement(sectionId, 80);
  };
  
  const features = [
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "Carbon Footprint Calculator",
      description: "Accurately measure your business's carbon emissions with our comprehensive calculator tool."
    },
    {
      icon: <Store className="w-6 h-6" />,
      title: "Verified Credit Marketplace",
      description: "Purchase high-quality, third-party verified carbon credits from global sustainability projects."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Carbon Neutral Certification",
      description: "Earn official certificates and digital badges to showcase your commitment to sustainability."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Impact Dashboard",
      description: "Track your progress, view detailed analytics, and monitor your environmental impact over time."
    }
  ];

  const stats = [
    { value: "2.5M+", label: "Tons CO2 Offset", icon: <Leaf className="w-5 h-5" /> },
    { value: "1,200+", label: "Businesses Certified", icon: <Users className="w-5 h-5" /> },
    { value: "45+", label: "Global Projects", icon: <Globe className="w-5 h-5" /> },
    { value: "98%", label: "Customer Satisfaction", icon: <Award className="w-5 h-5" /> }
  ];

  return (
    <div>
      {/* Scroll Navigation */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <button 
          onClick={() => scrollToSection('hero')} 
          className="p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all"
          aria-label="Scroll to top"
        >
          <ChevronDown className="w-5 h-5 transform rotate-180" />
        </button>
      </div>

      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Help Your Business Go Carbon Neutral
          </h1>
          <p className="hero-subtitle">
            In today's world, consumers choose brands that align with their values. 
            Becoming carbon-neutral isn't just good for the planet—it's smart business strategy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link to="/calculator" className="btn-primary">
              Calculate Your Impact
            </Link>
            <Link to="/marketplace" className="btn-secondary">
              Browse Projects
            </Link>
          </div>
          <div className="mt-10 flex justify-center">
            <button 
              onClick={() => scrollToSection('stats')} 
              className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-all"
              aria-label="Scroll to stats"
            >
              <span>Explore More</span>
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="section-padding bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2" style={{ color: 'var(--accent-primary)' }}>
                  {stat.icon}
                </div>
                <div className="heading-2 mb-1">{stat.value}</div>
                <div className="body-small">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <button 
            onClick={() => scrollToSection('features')} 
            className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-all"
            aria-label="Scroll to features"
          >
            <span>See Our Features</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding" style={{ backgroundColor: 'var(--bg-section)' }}>
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Complete Carbon Neutrality Solution</h2>
            <p className="body-large max-w-2xl mx-auto">
              We provide a clear pathway for your business to achieve carbon neutrality through 
              measurement, offsetting, and continuous improvement.
            </p>
          </div>
          
          <div className="feature-grid">
            {features.map((feature, index) => (
              <div key={index} className="product-card text-center">
                <div className="flex justify-center mb-4" style={{ color: 'var(--accent-primary)' }}>
                  {feature.icon}
                </div>
                <h3 className="heading-3 mb-3">{feature.title}</h3>
                <p className="body-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">How It Works</h2>
            <p className="body-large max-w-2xl mx-auto">
              Simple steps to make your business carbon neutral
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold" style={{ color: 'var(--accent-text)' }}>1</span>
              </div>
              <h3 className="heading-3 mb-3">Measure Your Impact</h3>
              <p className="body-medium">
                Use our comprehensive calculator to accurately assess your business's carbon footprint 
                across all operations and supply chains.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold" style={{ color: 'var(--accent-text)' }}>2</span>
              </div>
              <h3 className="heading-3 mb-3">Offset Your Emissions</h3>
              <p className="body-medium">
                Purchase verified carbon credits from high-quality projects that actively remove 
                or reduce greenhouse gases from the atmosphere.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold" style={{ color: 'var(--accent-text)' }}>3</span>
              </div>
              <h3 className="heading-3 mb-3">Get Certified</h3>
              <p className="body-medium">
                Receive official carbon-neutral certification and showcase your environmental 
                commitment to attract conscious consumers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-section)' }}>
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Featured Carbon Offset Projects</h2>
            <p className="body-large max-w-2xl mx-auto">
              Support verified projects that create measurable environmental impact
            </p>
          </div>

          <div className="feature-grid">
            {mockCarbonProjects.slice(0, 3).map((project) => (
              <div key={project.id} className="product-card">
                <div className="flex justify-between items-start mb-4">
                  <span className="body-small px-3 py-1 bg-green-100 text-green-800 rounded-full">
                    {project.type}
                  </span>
                  <span className="body-small font-semibold" style={{ color: 'var(--accent-text)' }}>
                    ${project.pricePerCredit}/credit
                  </span>
                </div>
                
                <h3 className="heading-3 mb-2">{project.name}</h3>
                <p className="body-small mb-3" style={{ color: 'var(--text-secondary)' }}>
                  📍 {project.location}
                </p>
                <p className="body-medium mb-4">{project.description}</p>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="body-small">
                      {project.availableCredits.toLocaleString()} credits available
                    </span>
                    {project.verified && (
                      <span className="body-small text-green-600 font-medium">✓ Verified</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/marketplace" className="btn-primary">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Success Stories</h2>
            <p className="body-large max-w-2xl mx-auto">
              Join over 1,200 businesses that have achieved carbon neutrality
            </p>
          </div>

          <div className="feature-grid">
            {mockBusinesses.map((business) => (
              <div key={business.id} className="product-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{business.logo}</div>
                  <div>
                    <h3 className="heading-3">{business.name}</h3>
                    <p className="body-small">{business.industry}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="body-medium">Carbon Footprint:</span>
                    <span className="body-medium font-semibold">
                      {business.carbonFootprint} tons CO2
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="body-medium">Credits Purchased:</span>
                    <span className="body-medium font-semibold" style={{ color: 'var(--accent-text)' }}>
                      {business.offsetCredits} credits
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="body-medium">Status:</span>
                    <span className={`body-small px-2 py-1 rounded-full ${
                      business.status === 'Carbon Neutral' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {business.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--accent-wash)' }}>
        <div className="container text-center">
          <h2 className="heading-2 mb-4">Ready to Go Carbon Neutral?</h2>
          <p className="body-large max-w-2xl mx-auto mb-8">
            Join the movement of businesses creating a sustainable future. Calculate your impact, 
            offset your emissions, and attract environmentally conscious customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/calculator" className="btn-primary">
              Start Your Journey
            </Link>
            <Link to="/contact" className="btn-secondary">
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};