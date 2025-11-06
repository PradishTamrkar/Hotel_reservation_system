import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { Card } from '@components/common/Card';
import { roomCategoryService, getImageUrl, validationUtils, authUtils } from '@services/api/api.js';
import toast from 'react-hot-toast';

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

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const categoryData = await roomCategoryService.getById(categoryId);
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

  const handleRoomSelection = (roomId) => {
    setSelectedRooms((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );
  };

  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate || selectedRooms.length === 0) return 0;
    const nights = validationUtils.calculateNights(checkInDate, checkOutDate);
    const pricePerNight = parseFloat(category?.price_per_night || 0);
    return selectedRooms.length * pricePerNight * nights;
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
      navigate('/auth-options', { state: { bookingData } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary-main" />
      </div>
    );
  }

  const nights = checkInDate && checkOutDate ? validationUtils.calculateNights(checkInDate, checkOutDate) : 0;
  const availableRooms = rooms.filter(r => r.room_status === 'Available');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Button variant="ghost" onClick={() => navigate(-1)} icon={ArrowLeft} className="mb-6">
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-8">
          Select Rooms - {category?.room_catagory_name}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Room Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date Selection */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Select Your Dates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Check-in Date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                <Input
                  type="date"
                  label="Check-out Date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  min={checkInDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </Card>

            {/* Available Rooms */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Available Rooms ({availableRooms.length})
              </h2>
              {availableRooms.length === 0 ? (
                <Card className="p-6 text-center text-gray-500">
                  No rooms available in this category
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableRooms.map((room) => (
                    <Card
                      key={room.room_id}
                      className={`cursor-pointer transition-all ${
                        selectedRooms.includes(room.room_id)
                          ? 'ring-2 ring-primary-main shadow-lg'
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => handleRoomSelection(room.room_id)}
                    >
                      <img
                        src={getImageUrl(room.room_images)}
                        alt={`Room ${room.room_no}`}
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400';
                        }}
                      />
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-semibold">Room {room.room_no}</h3>
                          <input
                            type="checkbox"
                            checked={selectedRooms.includes(room.room_id)}
                            onChange={() => handleRoomSelection(room.room_id)}
                            className="w-5 h-5 text-primary-main rounded"
                          />
                        </div>
                        <p className="text-sm text-gray-600">Capacity: {room.capacity} guests</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          {room.room_status}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary - Sticky */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{category?.room_catagory_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Selected Rooms</p>
                  <p className="font-medium">{selectedRooms.length} room(s)</p>
                </div>
                {checkInDate && checkOutDate && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Check-in</p>
                      <p className="font-medium">{validationUtils.formatDate(checkInDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Check-out</p>
                      <p className="font-medium">{validationUtils.formatDate(checkOutDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Number of Nights</p>
                      <p className="font-medium">{nights}</p>
                    </div>
                  </>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary-main">
                    {validationUtils.formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                icon={ShoppingCart}
                onClick={handleProceedToBooking}
                disabled={selectedRooms.length === 0 || !checkInDate || !checkOutDate}
              >
                Proceed to Booking
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}