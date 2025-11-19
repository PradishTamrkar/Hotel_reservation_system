import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '@features/customer/landing/LandingPage';
import RoomCategoryDetailPage from '@features/customer/roomCategoryDetail/RoomCategoryDetailPage';
import RoomSelectionPage from '@features/customer/roomSelection/RoomSelectionPage';
import BookingPage from '@features/customer/booking/BookingPage';
import BookingConfirmationPage from '@features/customer/confirmation/BookingConfirmationPage';
import BookingHistoryPage from '@features/customer/bookingHistory/BookingHistoryPage';
import SearchRoomsPage from '@features/customer/search/SearchRoomResultPage';
import AdminLogin from '@features/admin/AdminLogin';
import AdminLayout from '@features/admin/components/AdminLayout';
import AdminDashboard from '@features/admin/AdminDashboard';
import ProtectedAdminRoute from '@features/admin/components/ProtectedAdminRoute';
import RoomCategoriesPage from '@features/admin/roomCategories/RoomCategoriesPage';
import RoomsPage from '@features/admin/rooms/RoomPage';
import OffersPage from '@features/admin/offers/OffersPage';
import FAQPage from '@features/admin/faq/FAQPage';
import TestimonialsPage from '@features/admin/testimonials/TestimonialsPage';
import HotelAmenitiesPage from '@features/admin/hotelAmenities/HotelAmenitiesPage';
import ContactMsgPage from '@features/admin/contactMsg/ContactMsgPage';
import BookingsPage from '@features/admin/bookings/BookingsPage';
import RoomAmenitiesPage from '@features/admin/roomAmenities/RoomAmenitiesPage';
import AmenityBridgePage from '@features/admin/amenityBridge/AmenityBridgePage';
import ViewUserPage from '@features/admin/viewUsers/ViewUsersPage';

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
      <Route path="/booking/history" element={<BookingHistoryPage />} />

      {/*Admin Routes*/}
      <Route path='/admin/login' element={<AdminLogin />} />
      <Route path='/admin' element={
        <ProtectedAdminRoute>
          <AdminLayout />
        </ProtectedAdminRoute>
      } >
        <Route path='dashboard' element={<AdminDashboard />} />
        <Route path='room-categories' element={<RoomCategoriesPage />} />
        <Route path='rooms' element={<RoomsPage />} />
        <Route path='offers' element={<OffersPage />} />
        <Route path='faq' element={<FAQPage />} />
        <Route path='testimonials' element={<TestimonialsPage />} />
        <Route path='hotel-amenities' element={<HotelAmenitiesPage />} />
        <Route path='contact-messages' element={<ContactMsgPage />} />
        <Route path='bookings' element={<BookingsPage />} />
        <Route path='room-amenities' element={<RoomAmenitiesPage />} />
        <Route path='amenity-bridge' element={<AmenityBridgePage />} />
        <Route path='users' element={<ViewUserPage />} />
      </Route>
    </Routes>
  );
}

export default App;