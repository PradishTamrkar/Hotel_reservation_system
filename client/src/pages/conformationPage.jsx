import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container, Box, Typography, Button, Paper, Divider,
  Alert, Grid
} from '@mui/material';
import {
  CheckCircle, Home, Receipt, Person, CalendarToday,
  Hotel as HotelIcon
} from '@mui/icons-material';
import { validationUtils } from '../services/api';

export default function BookingConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;
  const bookingDetails = location.state?.bookingDetails;

  if (!booking || !bookingDetails) {
    navigate('/');
    return null;
  }

  const nights = validationUtils.calculateNights(
    bookingDetails.check_in_date,
    bookingDetails.check_out_date
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e4e4e4ff  0%, #c98014ff 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={24} sx={{ p: 5, borderRadius: 3, textAlign: 'center' }}>
          {/* Success Icon */}
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              bgcolor: 'success.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <CheckCircle sx={{ fontSize: 60, color: 'success.main' }} />
          </Box>

          <Typography variant="h3" fontWeight={700} gutterBottom>
            Booking Confirmed!
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Your reservation has been successfully created
          </Typography>

          <Alert severity="success" sx={{ my: 3 }}>
            Booking ID: <strong>{booking.booking_id}</strong>
          </Alert>

          <Divider sx={{ my: 4 }} />

          {/* Booking Details */}
          <Grid container spacing={3} sx={{ textAlign: 'left', mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1" fontWeight={600}>
                  Guest Information
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {bookingDetails.customerInfo.first_name}{' '}
                {bookingDetails.customerInfo.middle_name}{' '}
                {bookingDetails.customerInfo.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {bookingDetails.customerInfo.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {bookingDetails.customerInfo.phone_no}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1" fontWeight={600}>
                  Stay Details
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Check-in: {validationUtils.formatDate(bookingDetails.check_in_date)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Check-out: {validationUtils.formatDate(bookingDetails.check_out_date)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {nights} night{nights > 1 ? 's' : ''}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HotelIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1" fontWeight={600}>
                  Rooms
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {bookingDetails.rooms.length} room{bookingDetails.rooms.length > 1 ? 's' : ''} booked
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Receipt sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1" fontWeight={600}>
                  Total Amount
                </Typography>
              </Box>
              <Typography variant="h5" color="primary" fontWeight={700}>
                {validationUtils.formatCurrency(bookingDetails.total_amount)}
              </Typography>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mb: 3 }}>
            A confirmation email has been sent to {bookingDetails.customerInfo.email}
          </Alert>

          <Divider sx={{ my: 3 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Home />}
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Receipt />}
              onClick={() => navigate('/booking/history')}
            >
              View My Bookings
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}