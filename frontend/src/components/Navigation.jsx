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
    <nav className="nav-header-enhanced">
      <div className="nav-logo-enhanced">
        <div className="nav-logo-icon">
          <Leaf className="w-3 h-3 text-white" />
        </div>
        <Link to="/" className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
          CREDIT CARBON
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-2">
        {visibleNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link-enhanced ${isActive(item.path) ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Auth Section */}
      <div className="hidden md:flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <div className="user-badge-enhanced">
              <User className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
              <span className="body-small font-medium" style={{ color: 'var(--text-primary)' }}>
                {business?.name}
              </span>
            </div>
            <button
              onClick={logout}
              className="nav-link-enhanced flex items-center gap-2"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link-enhanced">
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
        <div className="mobile-menu-enhanced md:hidden">
          <div className="flex flex-col gap-3">
            {visibleNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link-enhanced ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-3 border-t border-white/20">
              {isAuthenticated ? (
                <>
                  <div className="user-badge-enhanced">
                    <User className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                    <span className="body-small font-medium" style={{ color: 'var(--text-primary)' }}>
                      {business?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="nav-link-enhanced flex items-center gap-2 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="nav-link-enhanced"
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
