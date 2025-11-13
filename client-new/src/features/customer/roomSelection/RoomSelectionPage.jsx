import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { roomCategoryService } from '@services/api/api.js';
import validationUtils from '@services/utils/validation.js';
import authUtils from '@services/utils/auth.js';
import toast from 'react-hot-toast';
import { AuthModal } from '@common/AuthModel';

// Component imports
import RoomSelectionHeader from '@features/customer/roomSelection/components/RoomSelectionHeader';
import DateSelection from '@features/customer/roomSelection/components/DateSelectionCard';
import RoomList from '@features/customer/roomSelection/components/RoomList';
import BookingSummary from '@features/customer/roomSelection/components/BookingSummary';

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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const categoryData = await roomCategoryService.getById(categoryId);
        console.log('Category with offer data:', categoryData);
        setCategory(categoryData[0]);
        
        const roomsData = await roomCategoryService.getRoomsByCategory(categoryId);
        setRooms(roomsData.rooms || []);
      } catch (err) {
        toast.error(err.message || 'Failed to load rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [categoryId]);

  const handleRoomSelection = (roomId, isAvailable) => {
    if (!isAvailable) {
      toast.error('This room is not available');
      return;
    }
    
    setSelectedRooms((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );
  };

  // Calculate prices with discount
  const hasOffer = category?.offer_id && category?.offered_discount;
  const originalPrice = parseFloat(category?.price_per_night || 0);
  const discountedPrice = hasOffer 
    ? originalPrice * (1 - category.offered_discount / 100) 
    : originalPrice;
  const savingsPerNight = hasOffer ? originalPrice - discountedPrice : 0;

  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate || selectedRooms.length === 0) return 0;
    const nights = validationUtils.calculateNights(checkInDate, checkOutDate);
    return selectedRooms.length * discountedPrice * nights;
  };

  const calculateTotalSavings = () => {
    if (!checkInDate || !checkOutDate || selectedRooms.length === 0 || !hasOffer) return 0;
    const nights = validationUtils.calculateNights(checkInDate, checkOutDate);
    return selectedRooms.length * savingsPerNight * nights;
  };

  const handleProceedToBooking = () => {
    if (selectedRooms.length === 0) {
      toast.error('Please select at least one room');
      return;
    }

    if (!checkInDate || !checkOutDate) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (!validationUtils.isValidDateRange(checkInDate, checkOutDate)) {
      toast.error('Invalid date range');
      return;
    }

    const bookingData = {
      rooms: selectedRooms.map((roomId) => ({ room_id: roomId })),
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      category_id: categoryId,
      total_amount: calculateTotal(),
    };

    if (authUtils.isAuthenticated()) {
      navigate('/booking', { state: { bookingData } });
    } else {
      // Show auth modal instead of navigating to separate page
      setPendingBookingData(bookingData);
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = (isGuestMode = false) => {
    setShowAuthModal(false);
    if (isGuestMode) {
      // Continue as guest
      navigate('/booking', { state: { bookingData: pendingBookingData, isGuest: true } });
    } else {
      // Logged in, proceed to booking
      navigate('/booking', { state: { bookingData: pendingBookingData } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <RoomSelectionHeader 
          category={category}
          hasOffer={hasOffer}
          savingsPerNight={savingsPerNight}
        />

        <DateSelection
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          onCheckInChange={setCheckInDate}
          onCheckOutChange={setCheckOutDate}
        />

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Available Rooms ({rooms.length})
          </h2>
          <RoomList
            rooms={rooms}
            selectedRooms={selectedRooms}
            hasOffer={hasOffer}
            discountAmount={category?.offered_discount}
            originalPrice={originalPrice}
            discountedPrice={discountedPrice}
            savingsPerNight={savingsPerNight}
            onRoomSelect={handleRoomSelection}
          />
        </div>

        <BookingSummary
          category={category}
          selectedRooms={selectedRooms}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          hasOffer={hasOffer}
          originalPrice={originalPrice}
          discountedPrice={discountedPrice}
          calculateTotal={calculateTotal}
          calculateTotalSavings={calculateTotalSavings}
          onProceedToBooking={handleProceedToBooking}
        />

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          bookingData={pendingBookingData}
        />
      </div>
    </div>
  );
}