import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Container, Paper, TextField, Button, Typography, Box,
  Alert, InputAdornment, IconButton, Divider
} from '@mui/material';
import { Visibility, VisibilityOff, Hotel } from '@mui/icons-material';
import { customerService, validationUtils } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    customer_username: '',
    customer_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || '/';
  const bookingData = location.state?.bookingData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.customer_username || !formData.customer_password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await customerService.login(formData);

      // Dispatch auth change event for navbar
      window.dispatchEvent(new Event('authChange'));

      // Navigate based on context
      if (bookingData) {
        navigate('/booking', { state: { bookingData } });
      } else {
        navigate(from);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
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
        background: 'linear-gradient(135deg, #d4d4d4ff 0%, #e68f2cff 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={24} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Hotel sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your Hotel Himalayas account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="customer_username"
              value={formData.customer_username}
              onChange={handleChange}
              margin="normal"
              required
              autoFocus
            />

            <TextField
              fullWidth
              label="Password"
              name="customer_password"
              type={showPassword ? 'text' : 'password'}
              value={formData.customer_password}
              onChange={handleChange}
              margin="normal"
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, py: 1.5 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            component={Link}
            to="/"
            state={{ bookingData }}
            sx={{ mb: 2 }}
          >
            Book as Guest
          </Button>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link
                to="/signup"
                state={{ bookingData }}
                style={{ textDecoration: 'none', color: '#c56900ff', fontWeight: 600 }}
              >
                Sign Up
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