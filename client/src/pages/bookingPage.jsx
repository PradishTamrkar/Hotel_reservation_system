import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container, Box, Typography, Button, Grid, Paper, TextField,
  Alert, MenuItem, Divider, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress
} from '@mui/material';
import { CheckCircle, ArrowBack } from '@mui/icons-material';
import { bookingService, customerService, authUtils, validationUtils } from '../services/api';

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state?.bookingData;
  const isGuest = location.state?.isGuest;

  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone_no: '',
    gender: '',
    address: '',
    nationality: '',
    citizenship_id: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [customerData, setCustomerData] = useState(null);

  // Fetch customer data if logged in
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (authUtils.isAuthenticated() && !isGuest) {
        try {
          const user = authUtils.getCurrentUser();
          const data = await customerService.getById(user.id);
          setCustomerData(data);
          
          // Auto-fill form with customer data
          setFormData({
            first_name: data.first_name || '',
            middle_name: data.middle_name || '',
            last_name: data.last_name || '',
            email: data.email || '',
            phone_no: data.phone_no || '',
            gender: data.gender || '',
            address: data.address || '',
            nationality: data.nationality || '',
            citizenship_id: data.citizenship_id || '',
          });
        } catch (err) {
          console.error('Error fetching customer data:', err);
        }
      }
    };

    fetchCustomerData();
  }, [isGuest]);

  // Redirect if no booking data
  useEffect(() => {
    if (!bookingData) {
      navigate('/');
    }
  }, [bookingData, navigate]);

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

    if (!formData.phone_no || !formData.gender || !formData.address || 
        !formData.nationality || !formData.citizenship_id) {
      setError('Please fill in all required fields');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  const handleConfirmBooking = async () => {
    try {
      setLoading(true);
      setShowConfirmDialog(false);

      // Prepare booking payload
      const payload = {
        ...formData,
        ...bookingData,
        customer_id: customerData?.customer_id || null,
      };

      const response = await bookingService.create(payload);

      // Navigate to confirmation page
      navigate('/booking/confirmation', {
        state: {
          booking: response,
          bookingDetails: {
            ...bookingData,
            customerInfo: formData,
          },
        },
      });
    } catch (err) {
      setError(err.message || 'Failed to create booking');
      setLoading(false);
    }
  };

  if (!bookingData) {
    return null;
  }

  const nights = validationUtils.calculateNights(
    bookingData.check_in_date,
    bookingData.check_out_date
  );

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Back
        </Button>

        <Typography variant="h3" fontWeight={700} gutterBottom>
          Complete Your Booking
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={4}>
          {/* Guest Information Form */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Guest Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

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
                      label="Nationality"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Citizenship ID"
                      name="citizenship_id"
                      value={formData.citizenship_id}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      multiline
                      rows={2}
                      required
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  sx={{ mt: 3, py: 1.5 }}
                >
                  {loading ? 'Processing...' : 'Confirm Booking'}
                </Button>
              </form>
            </Paper>
          </Grid>

          {/* Booking Summary */}
          <Grid item xs={12} md={4}>
            <Paper elevation={4} sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Booking Summary
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Check-in
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {validationUtils.formatDate(bookingData.check_in_date)}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Check-out
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {validationUtils.formatDate(bookingData.check_out_date)}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Number of Nights
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {nights} night{nights > 1 ? 's' : ''}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Number of Rooms
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {bookingData.rooms.length} room{bookingData.rooms.length > 1 ? 's' : ''}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="h5" fontWeight={700} color="primary">
                  Total: {validationUtils.formatCurrency(bookingData.total_amount)}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Confirmation Dialog */}
        <Dialog
          open={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h5" fontWeight={600}>
              Confirm Your Booking
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Guest:</strong> {formData.first_name} {formData.middle_name} {formData.last_name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Email:</strong> {formData.email}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Phone:</strong> {formData.phone_no}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Check-in:</strong> {validationUtils.formatDate(bookingData.check_in_date)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Check-out:</strong> {validationUtils.formatDate(bookingData.check_out_date)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Rooms:</strong> {bookingData.rooms.length}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Nights:</strong> {nights}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" fontWeight={700} color="primary">
              Total Amount: {validationUtils.formatCurrency(bookingData.total_amount)}
            </Typography>

            <Alert severity="info" sx={{ mt: 2 }}>
              Please review all details carefully before confirming.
            </Alert>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setShowConfirmDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmBooking}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}