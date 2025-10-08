import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, business, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/calculator', label: 'Calculator', protected: true },
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/products', label: 'Eco Products' },
    { path: '/dashboard', label: 'Dashboard', protected: true }
  ];

  const isActive = (path) => location.pathname === path;

  // Filter nav items based on auth status
  const visibleNavItems = navItems.filter(item => 
    !item.protected || (item.protected && isAuthenticated)
  );

  return (
    <nav className="nav-header">
      <div className="flex items-center gap-2">
        <Leaf className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
        <Link to="/" className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
          CREDIT CARBON
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-1">
        {visibleNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Auth Section */}
      <div className="hidden md:flex items-center gap-2">
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50">
              <User className="w-4 h-4 text-green-600" />
              <span className="body-small text-green-800">{business?.name}</span>
            </div>
            <button 
              onClick={logout}
              className="nav-link flex items-center gap-1"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="btn-primary">
              Get Started
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        style={{ color: 'var(--text-primary)' }}
      >
        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mx-2 mt-2 p-4 md:hidden">
          <div className="flex flex-col gap-2">
            {visibleNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50">
                    <User className="w-4 h-4 text-green-600" />
                    <span className="body-small text-green-800">{business?.name}</span>
                  </div>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="nav-link flex items-center gap-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="btn-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};