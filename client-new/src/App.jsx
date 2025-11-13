import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '@features/customer/landing/LandingPage';
import RoomCategoryDetailPage from '@features/customer/roomCategoryDetail/RoomCategoryDetailPage';
import RoomSelectionPage from '@features/customer/roomSelection/RoomSelectionPage';
import BookingPage from '@features/customer/booking/BookingPage';
import BookingConfirmationPage from '@features/customer/confirmation/BookingConfirmationPage';
import SearchRoomsPage from '@features/customer/search/SearchRoomResultPage';
import AdminLogin from '@features/admin/AdminLogin';
import AdminLayout from '@features/admin/components/AdminLayout';
import AdminDashboard from '@features/admin/AdminDashboard';
import ProtectedAdminRoute from '@features/admin/components/ProtectedAdminRoute';
import RoomCategoriesPage from '@features/admin/roomCategories/RoomCategoriesPage';
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

      {/*Admin Routes*/}
      <Route path='/admin/login' element={<AdminLogin />} />
      <Route path='/admin' element={
        <ProtectedAdminRoute>
          <AdminLayout />
        </ProtectedAdminRoute>
      } >
        <Route path='dashboard' element={<AdminDashboard />} />
        <Route path='room-categories' element={<RoomCategoriesPage />} />
      </Route>
    </Routes>
  );
}

export default App;