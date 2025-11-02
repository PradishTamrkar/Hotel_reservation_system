import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container, Box, Typography, Button, Grid, Paper, Checkbox,
  TextField, Alert, CircularProgress, Card, CardContent,
  FormControlLabel, Divider, Chip
} from '@mui/material';
import { ArrowBack, ShoppingCart, Hotel, CheckCircle } from '@mui/icons-material';
import { roomCategoryService, validationUtils, authUtils } from '../services/api.js';

export default function RoomSelectionPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [rooms, setRooms] = useState([]);
  const [category, setCategory] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [checkInDate, setCheckInDate] = useState(location.state?.checkIn || '');
  const [checkOutDate, setCheckOutDate] = useState(location.state?.checkOut || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        
        // Fetch category details
        const categoryData = await roomCategoryService.getById(categoryId);
        setCategory(categoryData[0]);
        
        // Fetch rooms in this category
        const roomsData = await roomCategoryService.getRoomsByCategory(categoryId);
        setRooms(roomsData.rooms || []);
      } catch (err) {
        setError(err.message || 'Failed to load rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [categoryId]);

  const handleRoomSelection = (roomId) => {
    setSelectedRooms((prev) => {
      if (prev.includes(roomId)) {
        return prev.filter((id) => id !== roomId);
      } else {
        return [...prev, roomId];
      }
    });
  };

  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate || selectedRooms.length === 0) return 0;
    
    const nights = validationUtils.calculateNights(checkInDate, checkOutDate);
    const pricePerNight = parseFloat(category?.price_per_night || 0);
    return selectedRooms.length * pricePerNight * nights;
  };

  const handleProceedToBooking = () => {
    // Validation
    if (selectedRooms.length === 0) {
      setError('Please select at least one room');
      return;
    }

    if (!checkInDate || !checkOutDate) {
      setError('Please select check-in and check-out dates');
      return;
    }

    if (!validationUtils.isValidDateRange(checkInDate, checkOutDate)) {
      setError('Invalid date range. Check-out must be after check-in.');
      return;
    }

    // Prepare booking data
    const bookingData = {
      rooms: selectedRooms.map((roomId) => ({ room_id: roomId })),
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      category_id: categoryId,
      total_amount: calculateTotal(),
    };

    // Check if user is logged in
    if (authUtils.isAuthenticated()) {
      navigate('/booking', { state: { bookingData } });
    } else {
      navigate('/auth-options', { state: { bookingData } });
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
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Back
        </Button>

        <Typography variant="h3" fontWeight={700} gutterBottom>
          Select Rooms - {category?.room_catagory_name}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={4}>
          {/* Room Selection */}
          <Grid item xs={12} md={8}>
            {/* Date Selection */}
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Select Your Dates
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Check-in Date"
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: new Date().toISOString().split('T')[0]
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Check-out Date"
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: checkInDate || new Date().toISOString().split('T')[0]
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Available Rooms */}
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Available Rooms ({rooms.filter(r => r.room_status === 'Available').length})
            </Typography>

            {rooms.filter(r => r.room_status === 'Available').length === 0 ? (
              <Alert severity="info">No rooms available in this category</Alert>
            ) : (
              <Grid container spacing={2}>
                {rooms.filter(r => r.room_status === 'Available').map((room) => (
                  <Grid item xs={12} sm={6} key={room.room_id}>
                    <Card
                      elevation={selectedRooms.includes(room.room_id) ? 8 : 2}
                      sx={{
                        border: selectedRooms.includes(room.room_id)
                          ? '2px solid'
                          : '2px solid transparent',
                        borderColor: 'primary.main',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                        },
                      }}
                      onClick={() => handleRoomSelection(room.room_id)}
                    >
                      <Box
                        component="img"
                        src={room.room_images}
                        alt={`Room ${room.room_no}`}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400';
                        }}
                        sx={{ width: '100%', height: 150, objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" fontWeight={600}>
                            Room {room.room_no}
                          </Typography>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectedRooms.includes(room.room_id)}
                                onChange={() => handleRoomSelection(room.room_id)}
                              />
                            }
                            label=""
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Capacity: {room.capacity} guests
                        </Typography>
                        <Chip
                          label={room.room_status}
                          color="success"
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
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
                  Category
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {category?.room_catagory_name}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Selected Rooms
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedRooms.length} room(s)
                </Typography>
              </Box>

              {checkInDate && checkOutDate && (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Check-in
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {validationUtils.formatDate(checkInDate)}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Check-out
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {validationUtils.formatDate(checkOutDate)}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Number of Nights
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {validationUtils.calculateNights(checkInDate, checkOutDate)}
                    </Typography>
                  </Box>
                </>
              )}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={700} color="primary">
                  Total: {validationUtils.formatCurrency(calculateTotal())}
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleProceedToBooking}
                startIcon={<ShoppingCart />}
                disabled={selectedRooms.length === 0 || !checkInDate || !checkOutDate}
                sx={{ py: 1.5 }}
              >
                Proceed to Booking
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}