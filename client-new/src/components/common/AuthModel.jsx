import React, { useState } from 'react';
import { X, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@common/Button';
import { Input } from '@common/Input';
import { PasswordInput } from '@common/PasswordInput';
import { customerService } from '@services/api/api.js';
import validationUtils from '@services/utils/validation.js';
import toast from 'react-hot-toast';

export const AuthModal = ({ isOpen, onClose, onSuccess, bookingData }) => {
  const [mode, setMode] = useState('options'); // 'options', 'login', 'signup'
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    customer_username: '',
    customer_password: '',
  });
  const [signupData, setSignupData] = useState({
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

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.customer_username || !loginData.customer_password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await customerService.login(loginData);
      window.dispatchEvent(new Event('authChange'));
      toast.success('Login successful!');
      onSuccess();
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!signupData.first_name || !signupData.last_name) {
      toast.error('First name and last name are required');
      return;
    }

    if (!validationUtils.isValidEmail(signupData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!signupData.customer_username || signupData.customer_username.length < 4) {
      toast.error('Username must be at least 4 characters');
      return;
    }

    if (!signupData.customer_password || signupData.customer_password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (signupData.customer_password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!signupData.gender || !signupData.phone_no || !signupData.address || 
        !signupData.nationality || !signupData.citizenship_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const { confirmPassword, ...registrationData } = signupData;
      await customerService.register(registrationData);
      
      // Auto login
      await customerService.login({
        customer_username: signupData.customer_username,
        customer_password: signupData.customer_password,
      });

      window.dispatchEvent(new Event('authChange'));
      toast.success('Account created successfully!');
      onSuccess();
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestContinue = () => {
    onSuccess(true); // true indicates guest mode
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          {/* Options View */}
          {mode === 'options' && (
            <div>
              <h2 className="text-3xl font-bold text-center mb-2">How would you like to proceed?</h2>
              <p className="text-gray-600 text-center mb-8">Choose your preferred booking method</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => setMode('login')}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary hover:shadow-lg transition-all text-center"
                >
                  <LogIn className="w-12 h-12 mx-auto mb-3 text-primary" />
                  <h3 className="text-xl font-bold mb-2">Login</h3>
                  <p className="text-gray-600 text-sm">Sign in to your existing account</p>
                </button>

                <button
                  onClick={() => setMode('signup')}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-secondary hover:shadow-lg transition-all text-center"
                >
                  <UserPlus className="w-12 h-12 mx-auto mb-3 text-secondary" />
                  <h3 className="text-xl font-bold mb-2">Sign Up</h3>
                  <p className="text-gray-600 text-sm">Create a new account</p>
                </button>

                <button
                  onClick={handleGuestContinue}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-600 hover:shadow-lg transition-all text-center"
                >
                  <UserPlus className="w-12 h-12 mx-auto mb-3 text-green-600" />
                  <h3 className="text-xl font-bold mb-2">Guest</h3>
                  <p className="text-gray-600 text-sm">Book without an account</p>
                </button>
              </div>
            </div>
          )}

          {/* Login View */}
          {mode === 'login' && (
            <div>
              <button
                onClick={() => setMode('options')}
                className="text-primary hover:underline mb-4"
              >
                ← Back to options
              </button>
              <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
              <p className="text-gray-600 text-center mb-8">Sign in to your account</p>

              <form onSubmit={handleLogin} className="space-y-6 max-w-md mx-auto">
                <Input
                  label="Username"
                  value={loginData.customer_username}
                  onChange={(e) => setLoginData({ ...loginData, customer_username: e.target.value })}
                  required
                />
                <PasswordInput
                  value={loginData.customer_password}
                  onChange={(e) => setLoginData({ ...loginData, customer_password: e.target.value })}
                  required
                />
                <Button type="submit" className="w-full" loading={loading}>
                  Sign In
                </Button>
              </form>

              <p className="text-center mt-6 text-gray-600">
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="text-primary font-semibold hover:underline">
                  Sign Up
                </button>
              </p>
            </div>
          )}

          {/* Signup View */}
          {mode === 'signup' && (
            <div>
              <button
                onClick={() => setMode('options')}
                className="text-primary hover:underline mb-4"
              >
                ← Back to options
              </button>
              <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
              <p className="text-gray-600 text-center mb-8">Join Hotel Himalayas</p>

              <form onSubmit={handleSignup} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="First Name"
                    name="first_name"
                    value={signupData.first_name}
                    onChange={(e) => setSignupData({ ...signupData, first_name: e.target.value })}
                    required
                  />
                  <Input
                    label="Middle Name"
                    name="middle_name"
                    value={signupData.middle_name}
                    onChange={(e) => setSignupData({ ...signupData, middle_name: e.target.value })}
                  />
                  <Input
                    label="Last Name"
                    name="last_name"
                    value={signupData.last_name}
                    onChange={(e) => setSignupData({ ...signupData, last_name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Username"
                    name="customer_username"
                    value={signupData.customer_username}
                    onChange={(e) => setSignupData({ ...signupData, customer_username: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PasswordInput
                    label="Password"
                    name="customer_password"
                    value={signupData.customer_password}
                    onChange={(e) => setSignupData({ ...signupData, customer_password: e.target.value })}
                    required
                  />
                  <PasswordInput
                    label="Confirm Password"
                    name="confirmPassword"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={signupData.gender}
                      onChange={(e) => setSignupData({ ...signupData, gender: e.target.value })}
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
                    value={signupData.phone_no}
                    onChange={(e) => setSignupData({ ...signupData, phone_no: e.target.value })}
                    required
                  />
                  <Input
                    label="Nationality"
                    name="nationality"
                    value={signupData.nationality}
                    onChange={(e) => setSignupData({ ...signupData, nationality: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Citizenship ID"
                    name="citizenship_id"
                    value={signupData.citizenship_id}
                    onChange={(e) => setSignupData({ ...signupData, citizenship_id: e.target.value })}
                    required
                  />
                  <Input
                    label="Address"
                    name="address"
                    value={signupData.address}
                    onChange={(e) => setSignupData({ ...signupData, address: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" loading={loading}>
                  Sign Up
                </Button>
              </form>

              <p className="text-center mt-6 text-gray-600">
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-primary font-semibold hover:underline">
                  Sign In
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};