import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Hotel, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@common/Button';
import { Input } from '@common/Input';
import { customerService } from '@services/api/api.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    customer_username: '',
    customer_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || '/';
  const bookingData = location.state?.bookingData;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customer_username || !formData.customer_password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await customerService.login(formData);
      
      window.dispatchEvent(new Event('authChange'));
      toast.success('Login successful!');

      if (bookingData) {
        navigate('/booking', { state: { bookingData } });
      } else {
        navigate(from);
      }
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 to-orange-300 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <Hotel className="w-16 h-16 mx-auto text-primary mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your Hotel Himalayas account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username"
            value={formData.customer_username}
            onChange={(e) => setFormData({ ...formData, customer_username: e.target.value })}
            required
          />

          <div>
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.customer_password}
              onChange={(e) => setFormData({ ...formData, customer_password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <Button type="submit" className="w-full" loading={loading}>
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-gray-500 text-sm hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}