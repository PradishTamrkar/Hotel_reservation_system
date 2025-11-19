import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@common/Button';
import { roomCategoryService, roomService } from '@services/api/api.js';
import validationUtils from '@services/utils/validation.js';
import authUtils from '@services/utils/auth.js';
import toast from 'react-hot-toast';
import { AuthModal } from '@common/AuthModel';

// Component imports
import RoomSelectionHeader from '@features/customer/roomSelection/components/RoomSelectionHeader';
import DateFilter from '@features/customer/roomSelection/components/DateFilter';
import RoomList from '@features/customer/roomSelection/components/RoomList';
import BookingSummary from '@features/customer/roomSelection/components/BookingSummary';

export default function RoomSelectionPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [allRooms, setAllRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [category, setCategory] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [checkInDate, setCheckInDate] = useState(location.state?.checkIn || '');
  const [checkOutDate, setCheckOutDate] = useState(location.state?.checkOut || '');
  const [loading, setLoading] = useState(true);
  const [filteringRooms, setFilteringRooms] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState(null);

  // Fetch category and all rooms on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const categoryData = await roomCategoryService.getById(categoryId);
        setCategory(categoryData[0]);
        
        const roomsData = await roomCategoryService.getRoomsByCategory(categoryId);
        setAllRooms(roomsData.rooms || []);
        setFilteredRooms(roomsData.rooms || []);
      } catch (err) {
        toast.error(err.message || 'Failed to load rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [categoryId]);

  // Filter rooms when dates change
  useEffect(() => {
    const filterRoomsByDate = async () => {
      if (!checkInDate || !checkOutDate) {
        setFilteredRooms(allRooms);
        return;
      }

      // Validate dates
      if (!validationUtils.isValidDateRange(checkInDate, checkOutDate)) {
        toast.error('Invalid date range');
        return;
      }

      try {
        setFilteringRooms(true);
        
        // Fetch available rooms for the date range
        const availableData = await roomService.getAvailableByDate(checkInDate, checkOutDate);
        
        // Filter rooms that belong to this category
        const categoryRooms = availableData.categories.find(
          cat => cat.room_catagory_id === parseInt(categoryId)
        );
        
        if (categoryRooms && categoryRooms.available_rooms) {
          setFilteredRooms(categoryRooms.available_rooms);
          
          // Clear selected rooms that are no longer available
          setSelectedRooms(prev => 
            prev.filter(roomId => 
              categoryRooms.available_rooms.some(r => r.room_id === roomId)
            )
          );
        } else {
          setFilteredRooms([]);
          setSelectedRooms([]);
          toast.info('No rooms available for selected dates');
        }
      } catch (err) {
        console.error('Error filtering rooms:', err);
        toast.error('Failed to filter rooms by date');
        setFilteredRooms(allRooms);
      } finally {
        setFilteringRooms(false);
      }
    };

    filterRoomsByDate();
  }, [checkInDate, checkOutDate, categoryId, allRooms]);

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
      setPendingBookingData(bookingData);
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = (isGuestMode = false) => {
    setShowAuthModal(false);
    if (isGuestMode) {
      navigate('/booking', { state: { bookingData: pendingBookingData, isGuest: true } });
    } else {
      navigate('/booking', { state: { bookingData: pendingBookingData } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className='text-lg text-gray-600 ml-3'>Loading Rooms...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            icon={ArrowLeft}
            size="sm"
          >
            Back
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <RoomSelectionHeader 
          category={category}
          hasOffer={hasOffer}
          savingsPerNight={savingsPerNight}
        />

        {/* Main Content - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Date Filter & Rooms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date Filter */}
            <DateFilter
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              onCheckInChange={setCheckInDate}
              onCheckOutChange={setCheckOutDate}
              filteringRooms={filteringRooms}
            />

            {/* Rooms List */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Rooms ({filteredRooms.length})
                </h2>
                {checkInDate && checkOutDate && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {validationUtils.calculateNights(checkInDate, checkOutDate)} night(s)
                    </span>
                  </div>
                )}
              </div>

              {filteringRooms ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-3 text-gray-600">Filtering rooms...</span>
                </div>
              ) : (
                <RoomList
                  rooms={filteredRooms}
                  selectedRooms={selectedRooms}
                  hasOffer={hasOffer}
                  discountAmount={category?.offered_discount}
                  originalPrice={originalPrice}
                  discountedPrice={discountedPrice}
                  savingsPerNight={savingsPerNight}
                  onRoomSelect={handleRoomSelection}
                />
              )}
            </div>
          </div>

          {/* Right Column - Booking Summary (Sticky) */}
          <div className="lg:col-span-1">
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
          </div>
        </div>

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