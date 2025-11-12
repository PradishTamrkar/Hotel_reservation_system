import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '@features/landing/LandingPage';
import LoginPage from '@pages/LoginPage';
import SignupPage from '@pages/SignupPage';
import RoomCategoryDetailPage from '@features/roomCategoryDetail/RoomCategoryDetailPage';
import RoomSelectionPage from '@features/roomSelection/RoomSelectionPage';
import BookingPage from '@pages/BookingPage';
import BookingConfirmationPage from '@pages/BookingConfirmationPage';
// import BookingHistoryPage from '@pages/BookingHistoryPage';
import AuthOptionsPage from '@pages/AuthOptionsPage';
import SearchRoomsPage from './pages/SearchRoomResultPage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/auth-options" element={<AuthOptionsPage />} />
      
      {/* Room Routes */}
      <Route path="/search-rooms" element={<SearchRoomsPage />} /> 
      <Route path="/roomCatagory/:id" element={<RoomCategoryDetailPage />} />
      <Route path="/rooms/category/:categoryId" element={<RoomSelectionPage />} />
      
      {/* Booking Routes */}
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/booking/confirmation" element={<BookingConfirmationPage />} />
      {/* <Route path="/booking/history" element={<BookingHistoryPage />} /> */}
    </Routes>
  );
}

export default App;