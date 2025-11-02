import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Stack,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  useScrollTrigger,
} from '@mui/material';
import {
  Hotel,
  Menu as MenuIcon,
  Person,
  History,
  Logout,
  AccountCircle,
} from '@mui/icons-material';
import { authUtils, customerService } from '../services/api';

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
      transition: 'all 0.3s',
    },
  });
}

export default function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  // Check authentication status on mount and after login/logout
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authUtils.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const currentUser = authUtils.getCurrentUser();
        setUser(currentUser);
      } else {
        setUser(null);
      }
    };

    checkAuth();

    // Listen for storage changes (login/logout in other tabs)
    window.addEventListener('storage', checkAuth);
    
    // Custom event for same-tab login/logout
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleBookingHistory = () => {
    handleMenuClose();
    navigate('/booking/history');
  };

  const handleLogout = () => {
    handleMenuClose();
    
    // Clear authentication
    customerService.logout();
    setIsAuthenticated(false);
    setUser(null);
    
    // Dispatch custom event for other components
    window.dispatchEvent(new Event('authChange'));
    
    // Navigate to home
    navigate('/');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.customer_username) {
      return user.customer_username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <ElevationScroll>
      <AppBar position="fixed">
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/* Logo - Desktop */}
            <Hotel sx={{ mr: 1, display: { xs: 'none', md: 'flex' } }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                display: { xs: 'none', md: 'flex' },
                cursor: 'pointer',
              }}
              onClick={() => navigate('/')}
            >
              Hotel Himalayas
            </Typography>

            {/* Mobile Menu Icon */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton size="large" color="inherit">
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Logo - Mobile */}
            <Hotel sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                display: { xs: 'flex', md: 'none' },
                cursor: 'pointer',
              }}
              onClick={() => navigate('/')}
            >
              Hotel Himalayas
            </Typography>

            {/* Navigation Links - Desktop */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, mr: 3 }}>
              <Button color="inherit" href="#rooms">
                Room Categories
              </Button>
              <Button color="inherit" href="#amenities">
                Amenities
              </Button>
              <Button color="inherit" href="#about">
                About
              </Button>
              <Button color="inherit" href="#contact">
                Contact
              </Button>
            </Box>

            {/* Auth Buttons */}
            <Stack direction="row" spacing={2} alignItems="center">
              {isAuthenticated ? (
                <>
                  {/* User Avatar & Menu */}
                  <IconButton
                    onClick={handleMenuOpen}
                    size="small"
                    sx={{
                      border: '2px solid',
                      borderColor: 'inherit',
                    }}
                    aria-controls={openMenu ? 'user-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? 'true' : undefined}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'secondary.main',
                        fontSize: '0.875rem',
                      }}
                    >
                      {getUserInitials()}
                    </Avatar>
                  </IconButton>

                  {/* Dropdown Menu */}
                  <Menu
                    id="user-menu"
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleMenuClose}
                    onClick={handleMenuClose}
                    PaperProps={{
                      elevation: 4,
                      sx: {
                        mt: 1.5,
                        minWidth: 200,
                        '& .MuiMenuItem-root': {
                          px: 2,
                          py: 1.5,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    {/* User Info */}
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {user?.customer_username || 'User'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Customer
                      </Typography>
                    </Box>
                    <Divider />

                    {/* Menu Items */}
                    <MenuItem onClick={handleBookingHistory}>
                      <ListItemIcon>
                        <History fontSize="small" />
                      </ListItemIcon>
                      Booking History
                    </MenuItem>

                    <Divider />

                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <Logout fontSize="small" color="error" />
                      </ListItemIcon>
                      <Typography color="error">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  {/* Login & Signup Buttons */}
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleLoginClick}
                    sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSignupClick}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
    </ElevationScroll>
  );
}
