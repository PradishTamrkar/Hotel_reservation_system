import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Button, Grid, Paper, Chip,
  CircularProgress, Alert, Card, CardContent, Divider
} from '@mui/material';
import {
  Hotel, People, CheckCircle, ArrowBack, CalendarToday
} from '@mui/icons-material';
import { roomCategoryService, roomAmenityService, validationUtils } from '../services/api';

export default function RoomCategoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch category details
        const categoryData = await roomCategoryService.getById(id);
        console.log('Category Data:', categoryData); // Debug
        setCategory(categoryData[0]); // API returns array
        
        // Fetch amenities for this category
        const amenitiesData = await roomAmenityService.getByCategory(id);
        console.log('Amenities Data:', amenitiesData); // Debug
        setAmenities(amenitiesData);
      } catch (err) {
        console.error('Error:', err); // Debug
        setError(err.message || 'Failed to load room category details');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [id]);

  const handleBookNow = () => {
    navigate(`/rooms/category/${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !category) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error || 'Category not found'}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to Categories
        </Button>

        <Grid container spacing={4}>
          {/* Image Section - FIXED */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={4}
              sx={{
                height: 500,
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#f5f5f5', // Fallback background
              }}
            >
              <Box
                component="img"
                src={category.room_catagory_images}
                alt={category.room_catagory_name}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800';
                }}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain', // Changed from 'cover' to 'contain'
                  objectPosition: 'center', // Center the image
                }}
              />
            </Paper>
          </Grid>

          {/* Details Section */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                {category.room_catagory_name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="h4" color="primary" fontWeight={700}>
                  {validationUtils.formatCurrency(category.price_per_night)}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  per night
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" fontWeight={600} gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {category.room_catagory_description}
              </Typography>

              {/* Amenities Section */}
              {amenities.length > 0 && (
                <>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 3 }}>
                    Room Amenities
                  </Typography>
                  <Grid container spacing={1}>
                    {amenities.map((amenity) => (
                      <Grid item key={amenity.room_amenity_id}>
                        <Chip
                          icon={<CheckCircle />}
                          label={amenity.room_amenity_name}
                          color="primary"
                          variant="outlined"
                        />
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleBookNow}
                startIcon={<CalendarToday />}
                sx={{ mt: 4, py: 1.5 }}
              >
                View Available Rooms & Book Now
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}