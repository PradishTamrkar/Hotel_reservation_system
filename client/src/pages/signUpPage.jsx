import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Container, Paper, TextField, Button, Typography, Box,
  Alert, InputAdornment, IconButton, Grid, MenuItem
} from '@mui/material';
import { Visibility, VisibilityOff, Hotel } from '@mui/icons-material';
import { customerService, validationUtils } from '../services/api';

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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.first_name || !formData.last_name) {
      setError('First name and last name are required');
      return false;
    }

    if (!validationUtils.isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.customer_username || formData.customer_username.length < 4) {
      setError('Username must be at least 4 characters');
      return false;
    }

    if (!formData.customer_password || formData.customer_password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (formData.customer_password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!formData.gender || !formData.phone_no || !formData.address || 
        !formData.nationality || !formData.citizenship_id) {
      setError('Please fill in all required fields');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const { confirmPassword, ...registrationData } = formData;
      
      await customerService.register(registrationData);
      
      // Auto login after registration
      await customerService.login({
        customer_username: formData.customer_username,
        customer_password: formData.customer_password,
      });

      // Dispatch auth change event for navbar
      window.dispatchEvent(new Event('authChange'));

      // Navigate based on context
      if (bookingData) {
        navigate('/booking', { state: { bookingData } });
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg,  #d4d4d4ff 0%, #e68f2cff 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={24} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Hotel sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join Hotel Himalayas for a seamless booking experience
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Middle Name"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  name="customer_username"
                  value={formData.customer_username}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  name="customer_password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.customer_password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone_no"
                  value={formData.phone_no}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Citizenship ID"
                  name="citizenship_id"
                  value={formData.citizenship_id}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, py: 1.5 }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link
                to="/login"
                state={{ bookingData }}
                style={{ textDecoration: 'none', color: '#f38e2fff', fontWeight: 600 }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link
              to="/"
              style={{ textDecoration: 'none', color: '#888', fontSize: '14px' }}
            >
              Back to Home
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}