import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent,
  Box, TextField, Rating, IconButton, Divider, Paper, Stack, useScrollTrigger,
  CircularProgress
} from '@mui/material';
import {
  Hotel, Wifi, Restaurant, FitnessCenter, LocalParking, Security,
  Phone, Email, LocationOn, Menu as MenuIcon, ChevronLeft, ChevronRight
} from '@mui/icons-material';
import Alert from '@mui/material/Alert';
import { 
  roomCategoryService, 
  hotelAmenityService, 
  testimonialService,
  authUtils 
} from '../services/api';
import Navbar from '../componenets/navbar'

// Elevated AppBar on scroll
function ElevationScroll({ children }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
    sx: {
      ...children.props.sx,
      backgroundColor: trigger ? 'white' : 'transparent',
      color: trigger ? 'text.primary' : 'white',
      transition: 'all 0.3s'
    }
  });
}

// Hero Section
const HeroSection = ({ onBookNowClick }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const handleSearch = () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }
    onBookNowClick(checkIn, checkOut);
  };

  return (
    <Box
      id="home"
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(https://i.pinimg.com/1200x/f3/40/cf/f340cff300c3cc33491f5b911455c164.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        pt: 8,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h1" color="white" gutterBottom sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
              fontWeight: 700 
            }}>
              Welcome to Hotel Himalayas
            </Typography>
            <Typography variant="h5" color="white" paragraph sx={{ 
              opacity: 1,
              textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
              fontWeight: 700 
            }}>
              Experience luxury and comfort in the heart of the city
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={8} sx={{ p: 4, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(10px)' }}>
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Book Your Stay
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Check-in Date"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    min: new Date().toISOString().split('T')[0]
                  }}
                />
                <TextField
                  fullWidth
                  label="Check-out Date"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    min: checkIn || new Date().toISOString().split('T')[0]
                  }}
                />
                <Button 
                  variant="contained" 
                  size="large" 
                  fullWidth
                  onClick={handleSearch}
                  sx={{ py: 1.5 }}
                >
                  Search Available Rooms
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Room Categories Section
const RoomCategories = () => {
  const navigate = useNavigate();
  const [roomCatagory, setRoomCatagory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoomCatagories = async () => {
      try {
        setLoading(true);
        const response = await roomCategoryService.getAll();
        console.log('API Response:', response); // Debug log
        
        // Handle the nested structure from your backend
        const categories = response?.roomCategory || [];
        console.log('Categories:', categories); // Debug log
        
        setRoomCatagory(categories);
      } catch (error) {
        console.log('Error fetching room categories:', error);
        setError('Failed to load room categories');
      } finally {
        setLoading(false);
      }
    };
    fetchRoomCatagories();
  }, []);

  const handleViewDetails = (roomId) => {
    navigate(`/roomCatagory/${roomId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress /> 
      </Box>
    );
  }

  return (
    <Box id="rooms" sx={{ py: 10, bgcolor: 'background.default' }}>
    <Container maxWidth="xl">
    <Typography variant="h2" align="center" gutterBottom>
      Our Room Categories
    </Typography>
    <Typography
      variant="h6"
      align="center"
      color="text.secondary"
      paragraph
      sx={{ mb: 6 }}
    >
      Choose from our selection of comfortable and luxurious room catagories
    </Typography>

    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

    {/* Scrollable row */}
    <Box
      sx={{
        display: 'flex',
        overflowX: 'auto',
        gap: 3,
        pb: 2,
        scrollSnapType: 'x mandatory',
        '&::-webkit-scrollbar': {
          height: 8,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderRadius: 4,
        },
      }}
    >
      {roomCatagory.length === 0 ? (
        <Alert severity="info" sx={{ flex: '1 0 auto', minWidth: 300 }}>
          No room category available at the moment
        </Alert>
      ) : (
        roomCatagory.map((catagory) => (
          <Card
            key={catagory.room_catagory_id}
            elevation={3}
            sx={{
              flex: '0 0 350px',
              scrollSnapAlign: 'start',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 6,
              },
            }}
          >
            <Box
              component="img"
              src={catagory.room_catagory_images}
              alt={catagory.room_catagory_name}
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500';
              }}
              sx={{
                width: '100%',
                height: 200,
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <CardContent
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h5" gutterBottom fontWeight={600}>
                {catagory.room_catagory_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {catagory.room_catagory_description}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 'auto',
                  pt: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    color="primary"
                    component="span"
                    fontWeight={700}
                  >
                    Rs{catagory.price_per_night}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="span"
                  >
                    /night
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ py: 1.5, ml: 2 }}
                  onClick={() => handleViewDetails(catagory.room_catagory_id)}
                >
                  View Details
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  </Container>
</Box>

  );
};

const AmenitiesSection = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false)

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        setLoading(true);
        const data = await hotelAmenityService.getAll();
        console.log('Amenities Data:', data); // ADD THIS DEBUG
        setAmenities(data || []);
      } catch (error) {
        console.error('Error fetching amenities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAmenities();
  }, []);

    const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

    useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [amenities]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 400; // Width of one card + gap
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Box id="amenities" sx={{ py: 10, bgcolor: 'white' }}>
      <Container maxWidth="xl">
        <Typography variant="h2" align="center" gutterBottom>
          Hotel Amenities
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Services that Our Hotel Provides
        </Typography>

        <Box
          sx={{ position: 'relative' }}>
          
          {showLeftArrow && (
            <IconButton
              onClick={() => scroll('left')}
              sx={{
                position: 'absolute',
                left: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'white',
                boxShadow: 2,
                '&:hover': {
                  bgcolor: 'grey.100',
                },
                display: { xs: 'none', md: 'flex' }
              }}
            >
              <ChevronLeft />
            </IconButton>
          )}

          {showRightArrow && (
            <IconButton
              onClick={() => scroll('right')}
              sx={{
                position: 'absolute',
                right: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'white',
                boxShadow: 2,
                '&:hover': {
                  bgcolor: 'grey.100',
                },
                display: { xs: 'none', md: 'flex' }
              }}
            >
              <ChevronRight />
            </IconButton>
          )}

           <Box
            ref={scrollContainerRef}
            sx={{
            display: 'flex',
            overflowX: 'auto',
            gap: 3,
            pb: 2,
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1',
                borderRadius: 4,
              },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'primary.main',
                borderRadius: 4,
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
            },
            '@media (max-width: 600px)': {
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
              },
          }}
        >
          {amenities.length === 0 ? (
            <Alert severity="info">No amenities available</Alert>
          ) : (
            amenities.map((amenity) => (
              <Card
                key={amenity.hotel_amenity_id}
                elevation={3}
                sx={{
                  flex: '0 0 350px',
                  scrollSnapAlign: 'start',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  }
                }}
              >
                <Box
                  component="img"
                  src={amenity.hotel_amenity_image}
                  alt={amenity.hotel_amenity_name}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500';
                  }}
                  sx={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography variant="h5" gutterBottom fontWeight={600}>
                    {amenity.hotel_amenity_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {amenity.hotel_amenity_description}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
        {
          amenities.length > 1 && (
            <Box
              sx={{
                display: { xs: 'flex', md: 'none' },
                justifyContent: 'center',
                gap: 1,
                mt: 2,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                ← Swipe to see more →
              </Typography>
            </Box>
          )
        }
        </Box>
      </Container>
    </Box>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const data = await testimonialService.getAll();
        console.log('Testimonials Data:', data); // ADD THIS DEBUG
        setTestimonials(data || []);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 10, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" align="center" gutterBottom>
          What Our Guests Say
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Read reviews from our satisfied customers
        </Typography>
        {testimonials.length === 0 ? (
          <Alert severity='info'>No testimonials available</Alert>
        ) : (
          <Grid container spacing={4}>
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <Grid item xs={12} md={4} key={testimonial.testimony_id || index}>
                <Card elevation={3} sx={{ height: '100%' }}>
                  <CardContent>
                    <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                    <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                      "{testimonial.comment}"
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" fontWeight={600}>
                      {testimonial.customer_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Verified Guest
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

// About Section
const AboutSection = () => {
  return (
    <Box
      id="about"
      sx={{
        minHeight: '50vh',
        backgroundImage: 'url(https://image-tc.galaxy.tf/wijpeg-6rc902e9t312jljywldrat8xl/york-pool-dusk-ok.jpg?width=1920)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        py: 8,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay
          zIndex: 1
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ textAlign: 'center' }}>
              {/* Title */}
              <Typography 
                variant="h2" 
                color="white" 
                gutterBottom 
                sx={{ 
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                  fontWeight: 700,
                  mb: 2
                }}
              >
                About Us
              </Typography>

              {/* Subtitle */}
              <Typography 
                variant="h5" 
                color="white" 
                paragraph 
                sx={{ 
                  opacity: 1,
                  textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                  fontWeight: 600,
                  mb: 4
                }}
              >
                Providing luxury accommodation in the heart of Kathmandu
              </Typography>

                <Typography 
                  variant="body1" 
                  paragraph 
                  sx={{ 
                    color: 'white',
                    fontSize: '1.5rem',
                    lineHeight: 1.8,
                    mb: 2
                  }}
                >
                  Hotel Himalayas is the premier choice for travelers seeking comfort and elegance. 
                  Located in the heart of the city, we offer world-class accommodation and services 
                  to make your stay unforgettable.
                </Typography>

                <Typography 
                  variant="body1" 
                  paragraph 
                  sx={{ 
                    color: 'white',
                    fontSize: '1.5rem',
                    lineHeight: 1.8,
                    mb: 0
                  }}
                >
                  With over 20 years of experience in hospitality, we pride ourselves on providing 
                  exceptional service and creating memorable experiences for our guests.
                </Typography>

              {/* Stats */}
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={6} sm={4}>
                  <Paper 
                    elevation={4}
                    sx={{ 
                      p: 3, 
                      textAlign: 'center', 
                      bgcolor: '#fd782bff',
                      color: 'white',
                      borderRadius: 2,
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                      }
                    }}
                  >
                    <Typography variant="h3" fontWeight={700} sx={{ mb: 0.5 }}>
                      500+
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.95 }}>
                      Happy Guests
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Paper 
                    elevation={4}
                    sx={{ 
                      p: 3, 
                      textAlign: 'center', 
                      bgcolor: '#bb4a46ff',
                      color: 'white',
                      borderRadius: 2,
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                      }
                    }}
                  >
                    <Typography variant="h3" fontWeight={700} sx={{ mb: 0.5 }}>
                      20+
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.95 }}>
                      Luxury Rooms
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Paper 
                    elevation={4}
                    sx={{ 
                      p: 3, 
                      textAlign: 'center', 
                      bgcolor: '#667eea',
                      color: 'white',
                      borderRadius: 2,
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                      }
                    }}
                  >
                    <Typography variant="h3" fontWeight={700} sx={{ mb: 0.5 }}>
                      20+
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.95 }}>
                      Years Experience
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Contact Section
const ContactSection = () => {
  return (
    <Box id="contact" sx={{ py: 10, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" align="center" gutterBottom>
          Get In Touch
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          We'd love to hear from you
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center', height: '100%' }}>
              <LocationOn sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Address</Typography>
              <Typography variant="body2" color="text.secondary">
                123 Paradise Street<br />
                Kathmandu, Nepal
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center', height: '100%' }}>
              <Phone sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Phone</Typography>
              <Typography variant="body2" color="text.secondary">
                +977 1234567890<br />
                +977 9876543210
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center', height: '100%' }}>
              <Email sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Email</Typography>
              <Typography variant="body2" color="text.secondary">
                info@hotelhimalayas.com<br />
                booking@hotelhimalayas.com
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Footer
const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom fontWeight={700}>
              Hotel Himalayas
            </Typography>
            <Typography variant="body2" color="grey.400">
              Your home away from home
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>Quick Links</Typography>
            <Stack spacing={1}>
              <Button color="inherit" href="#home" sx={{ justifyContent: 'flex-start', pl: 0 }}>Home</Button>
              <Button color="inherit" href="#rooms" sx={{ justifyContent: 'flex-start', pl: 0 }}>Rooms</Button>
              <Button color="inherit" href="#amenities" sx={{ justifyContent: 'flex-start', pl: 0 }}>Amenities</Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>Services</Typography>
            <Stack spacing={1}>
              <Typography variant="body2" color="grey.400">Room Service</Typography>
              <Typography variant="body2" color="grey.400">Restaurant</Typography>
              <Typography variant="body2" color="grey.400">Spa & Wellness</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>Contact</Typography>
            <Stack spacing={1}>
              <Typography variant="body2" color="grey.400">Kathmandu, Nepal</Typography>
              <Typography variant="body2" color="grey.400">+977 1234567890</Typography>
              <Typography variant="body2" color="grey.400">info@hotelhimalayas.com</Typography>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3, bgcolor: 'grey.700' }} />
        <Typography variant="body2" align="center" color="grey.400">
          © 2025 Hotel Himalayas. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

// Main Landing Page Component
export default function LandingPage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleBookNowClick = (checkIn, checkOut) => {
    // Navigate to all categories with dates
    navigate('/', { state: { checkIn, checkOut } });
    
    // Scroll to rooms section
    setTimeout(() => {
      document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <Box>
      <Navbar/>
      <HeroSection onBookNowClick={handleBookNowClick} />
      <RoomCategories />
      <AmenitiesSection />
      <TestimonialsSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </Box>
  );
}