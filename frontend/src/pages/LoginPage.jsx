import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Chrome } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle Google OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const businessId = urlParams.get('business_id');
    const businessName = urlParams.get('business_name');
    const error = urlParams.get('error');

    if (error) {
      console.error('Google OAuth error:', error);
      // You could show an error toast here
    } else if (token && businessId && businessName) {
      // Handle successful Google login
      loginWithGoogle(token, businessId, businessName, '');
      navigate('/dashboard');
    }
  }, [location, loginWithGoogle, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 25%, #b8ddc0 50%, #a8d3b0 75%, #98c9a0 100%)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Leaf className="w-8 h-8" style={{ color: 'var(--accent-primary)' }} />
            <span className="heading-2">Carbon Credit</span>
          </div>
          <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
            Sign in to your business account
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="heading-3">Welcome Back</CardTitle>
            <CardDescription>
              Enter your credentials to access your carbon neutrality dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Business Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your-business@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Login Button */}
            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Google OAuth implementation - using backend API
                  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
                  window.location.href = `${backendUrl}/api/auth/google`;
                }}
              >
                <Chrome className="w-4 h-4 mr-2" />
                Sign in with Google
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="body-small">
                Don't have an account?{' '}
                <Link to="/signup" className="link-text">
                  Register your business
                </Link>
              </p>
            </div>

            {/* Demo Account */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="body-small font-semibold text-blue-800 mb-1">Demo Account</p>
              <p className="body-small text-blue-700">
                Email: demo@ecotech.com<br />
                Password: demo123
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="body-small link-text">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
