
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Paper, Grid, Card, CardContent,
  Chip, Button, Alert, CircularProgress, Divider, IconButton
} from '@mui/material';
import {
  ArrowBack, CalendarToday, Hotel, Receipt, Cancel
} from '@mui/icons-material';
import { bookingService, authUtils, validationUtils } from '../services/api';

export default function BookingHistoryPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    if (!authUtils.isAuthenticated()) {
      navigate('/login', { state: { from: '/booking/history' } });
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await bookingService.getMyBookings();
        setBookings(data);
      } catch (err) {
        setError(err.message || 'Failed to load booking history');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.delete(bookingId);
      // Refresh bookings list
      const data = await bookingService.getMyBookings();
      setBookings(data);
      alert('Booking cancelled successfully');
    } catch (err) {
      alert(err.message || 'Failed to cancel booking');
    }
  };

  const getBookingStatus = (checkInDate) => {
    const today = new Date();
    const checkIn = new Date(checkInDate);
    
    if (checkIn > today) {
      return { label: 'Upcoming', color: 'success' };
    } else {
      return { label: 'Completed', color: 'default' };
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to Home
        </Button>

        <Typography variant="h3" fontWeight={700} gutterBottom>
          My Bookings
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {bookings.length === 0 ? (
          <Paper elevation={3} sx={{ p: 5, textAlign: 'center' }}>
            <Hotel sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No Bookings Yet
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              You haven't made any bookings yet. Start exploring our rooms!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              sx={{ mt: 2 }}
            >
              Browse Rooms
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {bookings.map((booking) => {
              const status = getBookingStatus(booking.check_in_date);
              const canCancel = new Date(booking.check_in_date) > new Date();

              return (
                <Grid item xs={12} key={booking.booking_id}>
                  <Card elevation={3}>
                    <CardContent>
                      <Grid container spacing={3}>
                        {/* Booking Info */}
                        <Grid item xs={12} md={8}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" fontWeight={600}>
                              Booking #{booking.booking_id}
                            </Typography>
                            <Chip
                              label={status.label}
                              color={status.color}
                              size="small"
                            />
                          </Box>

                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <CalendarToday sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Check-in
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    {validationUtils.formatDate(booking.check_in_date)}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <CalendarToday sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Check-out
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    {validationUtils.formatDate(booking.check_out_date)}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>

                          <Divider sx={{ my: 2 }} />

                          {/* Room Details */}
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Room Details
                          </Typography>
                          <Box>
                            {booking.room_details?.map((room, index) => (
                              <Box key={index} sx={{ mb: 1 }}>
                                <Typography variant="body2">
                                  <strong>{room.room_catagory_name}</strong> - Room {room.room_no}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {validationUtils.formatCurrency(room.price_per_night)} per night
                                </Typography>
                              </Box>
                            ))}
                          </Box>

                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Booked on: {validationUtils.formatDate(booking.booking_date)}
                          </Typography>
                        </Grid>

                        {/* Pricing & Actions */}
                        <Grid item xs={12} md={4}>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" color="text.secondary">
                              Total Amount
                            </Typography>
                            <Typography variant="h4" color="primary" fontWeight={700}>
                              {validationUtils.formatCurrency(booking.total_amount)}
                            </Typography>

                            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Receipt />}
                                onClick={() => navigate(`/booking/${booking.booking_id}`)}
                              >
                                View Details
                              </Button>

                              {canCancel && (
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  startIcon={<Cancel />}
                                  onClick={() => handleCancelBooking(booking.booking_id)}
                                >
                                  Cancel Booking
                                </Button>
                              )}
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
}