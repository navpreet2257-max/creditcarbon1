import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
              <span className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                Carbon Credit
              </span>
            </div>
            <p className="body-small max-w-sm">
              Helping businesses achieve carbon neutrality through verified offset projects and sustainable practices.
            </p>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <span className="body-small">hello@carbonjcredit.com</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="heading-3 mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/calculator" className="body-small hover:text-green-600 transition-colors">Carbon Calculator</Link></li>
              <li><Link to="/marketplace" className="body-small hover:text-green-600 transition-colors">Credit Marketplace</Link></li>
              <li><Link to="/products" className="body-small hover:text-green-600 transition-colors">Eco Products</Link></li>
              <li><Link to="/dashboard" className="body-small hover:text-green-600 transition-colors">Business Dashboard</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="heading-3 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="body-small hover:text-green-600 transition-colors">About Us</Link></li>
              <li><Link to="/impact" className="body-small hover:text-green-600 transition-colors">Our Impact</Link></li>
              <li><Link to="/partnerships" className="body-small hover:text-green-600 transition-colors">Partnerships</Link></li>
              <li><Link to="/careers" className="body-small hover:text-green-600 transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="heading-3 mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="body-small hover:text-green-600 transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="body-small hover:text-green-600 transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="body-small hover:text-green-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="body-small hover:text-green-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="body-small">
              © {currentYear} Carbon Credit. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="body-small">Verified by:</span>
              <div className="flex items-center gap-4">
                <span className="body-small font-medium">Verra Registry</span>
                <span className="body-small font-medium">Gold Standard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};