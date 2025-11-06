import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Hotel, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { customerService, validationUtils } from '@services/api/api.js';

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state?.bookingData;

  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    customer_username: '',
    customer_password: '',
    confirmPassword: '',
    gender: '',
    phone_no: '',
    address: '',
    nationality: '',
    citizenship_id: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.first_name || !formData.last_name) {
      toast.error('First name and last name are required');
      return false;
    }

    if (!validationUtils.isValidEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (!formData.customer_username || formData.customer_username.length < 4) {
      toast.error('Username must be at least 4 characters');
      return false;
    }

    if (!formData.customer_password || formData.customer_password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    if (formData.customer_password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (!formData.gender || !formData.phone_no || !formData.address || 
        !formData.nationality || !formData.citizenship_id) {
      toast.error('Please fill in all required fields');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      const { confirmPassword, ...registrationData } = formData;
      
      await customerService.register(registrationData);
      
      // Auto login
      await customerService.login({
        customer_username: formData.customer_username,
        customer_password: formData.customer_password,
      });

      window.dispatchEvent(new Event('authChange'));
      toast.success('Account created successfully!');

      if (bookingData) {
        navigate('/booking', { state: { bookingData } });
      } else {
        navigate('/');
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 to-orange-300 py-12 px-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <Hotel className="w-16 h-16 mx-auto text-primary-main mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">Join Hotel Himalayas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <Input
              label="Middle Name"
              name="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
            />
            <Input
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Username"
              name="customer_username"
              value={formData.customer_username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                label="Password"
                name="customer_password"
                type={showPassword ? 'text' : 'password'}
                value={formData.customer_password}
                onChange={handleChange}
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
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <Input
              label="Phone Number"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleChange}
              required
            />
            <Input
              label="Nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Citizenship ID"
              name="citizenship_id"
              value={formData.citizenship_id}
              onChange={handleChange}
              required
            />
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="w-full" loading={loading}>
            Sign Up
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" state={{ bookingData }} className="text-primary-main font-semibold hover:underline">
              Sign In
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