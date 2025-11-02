
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

import theme from './theme.js';

// Pages
import LandingPage from './pages/landingPage.jsx';
import LoginPage from './pages/loginPage.jsx';
import SignupPage from './pages/signUpPage.jsx';
import AuthOptionsPage from './pages/authOptionsPage.jsx';
import RoomCategoryDetailPage from './pages/roomCatagoryDetails.jsx';
import RoomSelectionPage from './pages/roomSelection.jsx';
import BookingPage from './pages/bookingPage.jsx';
import BookingConfirmationPage from './pages/conformationPage.jsx';
import BookingHistoryPage from './pages/bookingHistory.jsx';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/auth-options" element={<AuthOptionsPage />} />
          
          {/* Room Routes */}
          <Route path="/roomCatagory/:id" element={<RoomCategoryDetailPage />} />
          <Route path="/rooms/category/:categoryId" element={<RoomSelectionPage />} />
          
          {/* Booking Routes */}
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/booking/confirmation" element={<BookingConfirmationPage />} />
          <Route path="/booking/history" element={<BookingHistoryPage />} />
        </Routes>
    </ThemeProvider>
  );
}

export default App;
