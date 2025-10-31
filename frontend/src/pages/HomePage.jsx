import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Calculator, Store, TrendingUp, Award, Users, Globe, ChevronDown, Sparkles, Zap, Heart } from 'lucide-react';
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
      icon: <Calculator className="w-8 h-8" />,
      title: "Carbon Footprint Calculator",
      description: "Accurately measure your business's carbon emissions with our comprehensive calculator tool.",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: <Store className="w-8 h-8" />,
      title: "Verified Credit Marketplace",
      description: "Purchase high-quality, third-party verified carbon credits from global sustainability projects.",
      gradient: "from-green-500 to-teal-600"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Carbon Neutral Certification",
      description: "Earn official certificates and digital badges to showcase your commitment to sustainability.",
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Impact Dashboard",
      description: "Track your progress, view detailed analytics, and monitor your environmental impact over time.",
      gradient: "from-pink-500 to-rose-600"
    }
  ];

  const stats = [
    { value: "2.5M+", label: "Tons CO2 Offset", icon: <Leaf className="w-6 h-6" />, color: "text-green-500" },
    { value: "1,200+", label: "Businesses Certified", icon: <Users className="w-6 h-6" />, color: "text-blue-500" },
    { value: "45+", label: "Global Projects", icon: <Globe className="w-6 h-6" />, color: "text-purple-500" },
    { value: "98%", label: "Customer Satisfaction", icon: <Award className="w-6 h-6" />, color: "text-yellow-500" }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-full animate-parallax-float"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full animate-morphing-blob"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 rounded-full animate-liquid-float"></div>
      </div>

      {/* Particle Background */}
      <div className="particles-bg">
        {[...Array(10)].map((_, i) => (
          <div key={i} className={`particle`}></div>
        ))}
      </div>

      {/* Enhanced Navigation */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <button
          onClick={() => scrollToSection('hero')}
          className="group p-4 glass-card rounded-full hover-lift transition-all duration-300"
          aria-label="Scroll to top"
        >
          <ChevronDown className="w-5 h-5 transform rotate-180 group-hover:text-green-400 transition-colors" />
        </button>
      </div>

      {/* Enhanced Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
        <div className="absolute inset-0 bg-mesh-gradient opacity-30"></div>
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          <div className="mb-8 animate-bounce-in">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gradient animate-text-reveal">
              Carbon Neutral
              <span className="block text-white">Revolution</span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-blue-500 mx-auto mb-8 animate-elastic-scale"></div>
          </div>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up">
            Transform your business into a force for environmental good. Join the movement of companies
            creating a sustainable future through carbon neutrality.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up">
            <Link
              to="/calculator"
              className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full hover-lift hover-glow transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Calculate Impact
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>

            <Link
              to="/marketplace"
              className="group relative px-8 py-4 glass-card text-white font-semibold rounded-full hover-lift transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Store className="w-5 h-5" />
                Browse Projects
              </span>
            </Link>
          </div>

          <div className="mt-16 flex justify-center">
            <button
              onClick={() => scrollToSection('impact-stats')}
              className="group flex flex-col items-center gap-2 text-green-400 hover:text-green-300 transition-all animate-bounce"
              aria-label="Scroll to impact stats"
            >
              <span className="text-sm font-medium">Discover Impact</span>
              <ChevronDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float delay-1000">
          <Sparkles className="w-8 h-8 text-yellow-400 opacity-60" />
        </div>
        <div className="absolute bottom-32 right-16 animate-float delay-2000">
          <Heart className="w-6 h-6 text-pink-400 opacity-60" />
        </div>
        <div className="absolute top-1/3 right-20 animate-float delay-1500">
          <Zap className="w-7 h-7 text-blue-400 opacity-60" />
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section id="impact-stats" className="relative py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group animate-bounce-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 p-4 glass-card-hover rounded-full w-16 h-16 flex items-center justify-center mx-auto group-hover:animate-glow-pulse">
                  <div className={`${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 animate-text-reveal">{stat.value}</div>
                <div className="text-gray-400 text-sm uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-50 to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-5xl font-bold text-gradient mb-6">
              Complete Sustainability Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to measure, offset, and certify your carbon neutrality journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative animate-slide-in-bounce"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div id={`feature-${index}`} className="glass-card-hover p-8 card-floating h-full">
                  <div className={`mb-6 p-4 bg-gradient-to-r ${feature.gradient} rounded-full w-16 h-16 flex items-center justify-center text-white group-hover:animate-rotate-glow`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 group-hover:text-green-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Process Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-900 to-blue-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-text-reveal">
            <h2 className="text-5xl font-bold text-white mb-6">
              Your Path to Carbon Neutrality
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Three simple steps to transform your environmental impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Measure",
                description: "Calculate your complete carbon footprint across all operations",
                icon: <Calculator className="w-8 h-8" />,
                gradient: "from-blue-400 to-blue-600"
              },
              {
                step: "02",
                title: "Offset",
                description: "Purchase verified carbon credits from global sustainability projects",
                icon: <Leaf className="w-8 h-8" />,
                gradient: "from-green-400 to-green-600"
              },
              {
                step: "03",
                title: "Certify",
                description: "Receive official certification and showcase your commitment",
                icon: <Award className="w-8 h-8" />,
                gradient: "from-purple-400 to-purple-600"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="group relative animate-scale-in"
                style={{ animationDelay: `${index * 300}ms` }}
              >
                <div id={`process-${index}`} className="glass-card p-8 text-center hover-lift h-full">
                  <div className={`mb-6 p-6 bg-gradient-to-r ${item.gradient} rounded-full w-20 h-20 flex items-center justify-center text-white mx-auto group-hover:animate-glow-pulse`}>
                    {item.icon}
                  </div>
                  <div className="text-4xl font-bold text-green-400 mb-4">{item.step}</div>
                  <h3 className="text-2xl font-semibold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
        <div className="absolute inset-0 bg-mesh-gradient opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-bounce-in">
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Lead the
              <span className="block text-gradient">Green Revolution?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Join thousands of businesses already making a difference. Start your carbon neutrality journey today.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/calculator"
                className="group relative px-10 py-5 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg rounded-full hover-lift hover-glow transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  Start Your Journey
                </span>
              </Link>

              <Link
                to="/marketplace"
                className="group relative px-10 py-5 glass-card text-white font-bold text-lg rounded-full hover-lift transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Store className="w-6 h-6" />
                  Explore Projects
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
