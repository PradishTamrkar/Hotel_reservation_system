import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '@features/landing/LandingPage';
import RoomCategoryDetailPage from '@features/roomCategoryDetail/RoomCategoryDetailPage';
import RoomSelectionPage from '@features/roomSelection/RoomSelectionPage';
import BookingPage from '@features/booking/BookingPage';
import BookingConfirmationPage from '@features/confirmation/BookingConfirmationPage';
import SearchRoomsPage from '@features/search/SearchRoomResultPage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Room Routes */}
      <Route path="/search-rooms" element={<SearchRoomsPage />} /> 
      <Route path="/roomCatagory/:id" element={<RoomCategoryDetailPage />} />
      <Route path="/rooms/category/:categoryId" element={<RoomSelectionPage />} />
      
      {/* Booking Routes */}
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/booking/confirmation" element={<BookingConfirmationPage />} />
    </Routes>
  );
}

export default App;