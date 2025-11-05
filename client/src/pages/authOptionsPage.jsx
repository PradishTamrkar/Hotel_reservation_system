import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container, Paper, Button, Typography, Box, Grid
} from '@mui/material';
import { Login, PersonAdd, Person, Hotel, CenterFocusStrong } from '@mui/icons-material';

export default function AuthOptionsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state?.bookingData;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #e7e7e7ff 0%, #f3aa21ff 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={24} sx={{ p: 5, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Hotel sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" fontWeight={700} gutterBottom>
              How would you like to proceed?
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Choose your preferred booking method
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8,
                  },
                }}
                onClick={() => navigate('/login', { state: { bookingData } })}
              >
                <Login sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Login
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Sign in to your existing account for a faster checkout
                </Typography>
                <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                  Login
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8,
                  },
                }}
                onClick={() => navigate('/signup', { state: { bookingData } })}
              >
                <PersonAdd sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Sign Up
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Create a new account to track your bookings
                </Typography>
                <Button variant="contained" color="secondary" fullWidth sx={{ mt: 2 }}>
                  Sign Up
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8,
                  },
                }}
                onClick={() => navigate('/booking', { state: { bookingData, isGuest: true } })}
              >
                <Person sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Guest Checkout
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Book without creating an account
                </Typography>
                <Button variant="outlined" color="success" fullWidth sx={{ mt: 2 }}>
                  Continue as Guest
                </Button>
              </Paper>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="text"
              onClick={() => navigate('/')}
              sx={{ color: 'text.secondary' }}
            >
              Back to Home
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}