import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Loader2, CheckCircle, XCircle, Users } from 'lucide-react';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { Card } from '@components/common/Card';
import { roomCategoryService, getImageUrl } from '@services/api/api.js';
import validationUtils from '@services/utils/validation.js'
import authUtils from '@services/utils/auth.js';
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Select Rooms - {category?.room_catagory_name}
        </h1>

        <Card className="p-6 mb-8 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">Select Your Dates</h2>
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

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Available Rooms ({rooms.length})
          </h2>
          {rooms.length === 0 ? (
            <Card className="p-6 text-center text-gray-500 max-w-3xl mx-auto">
              No rooms found in this category
            </Card>
          ) : (
            <div className="space-y-6 max-w-5xl mx-auto">
              {rooms.map((room) => {
                const isAvailable = room.room_status === 'Available';
                const isSelected = selectedRooms.includes(room.room_id);
                
                return (
                  <Card
                    key={room.room_id}
                    className={`overflow-hidden cursor-pointer transition-all ${
                      isSelected
                        ? 'ring-2 ring-primary-main shadow-lg'
                        : isAvailable
                        ? 'hover:shadow-md'
                        : 'opacity-75'
                    }`}
                    onClick={() => handleRoomSelection(room.room_id, isAvailable)}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Image Section */}
                      <div className="relative md:w-2/5 h-64 md:h-auto">
                        <img
                          src={getImageUrl(room.room_images)}
                          alt={`Room ${room.room_no}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400';
                          }}
                        />
                        {!isAvailable && (
                          <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">
                            ALMOST SOLD OUT
                          </div>
                        )}
                      </div>

                      {/* Details Section */}
                      <div className="md:w-3/5 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Room {room.room_no}
                              </h3>
                              {room.room_description && (
                                <p className="text-gray-600 mb-3">
                                  {room.room_description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex items-center gap-2 text-gray-700 mb-2">
                              <Users className="w-5 h-5" />
                              <span>Capacity: {room.capacity} guests</span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="mb-4">
                            {isAvailable ? (
                              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                <CheckCircle className="w-4 h-4" />
                                <span>Available</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                                <XCircle className="w-4 h-4" />
                                <span>Unavailable</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Price Section */}
                        <div className="flex justify-between items-center pt-4 border-t">
                          <div>
                            <p className="text-sm text-gray-500">Rates from</p>
                            <p className="text-3xl font-bold text-gray-900">
                              {validationUtils.formatCurrency(category?.price_per_night || 0)}
                              <span className="text-sm font-normal text-gray-500 ml-2">per night</span>
                            </p>
                          </div>
                          {isAvailable && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRoomSelection(room.room_id, isAvailable);
                              }}
                              className={`whitespace-nowrap ${isSelected ? 'bg-blue-500 hover-700 text-white' : '' } `}
                            >
                              {isSelected ? 'Selected' : 'Select Room'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Booking Summary - Below */}
        <Card className="p-6 max-w-3xl mx-auto bg-white shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center border-b pb-4">Booking Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Category</p>
              <p className="font-semibold text-lg">{category?.room_catagory_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Selected Rooms</p>
              <p className="font-semibold text-lg">{selectedRooms.length} room(s)</p>
            </div>
            {checkInDate && checkOutDate && (
              <>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Check-in</p>
                  <p className="font-semibold">{validationUtils.formatDate(checkInDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Check-out</p>
                  <p className="font-semibold">{validationUtils.formatDate(checkOutDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Number of Nights</p>
                  <p className="font-semibold">{nights}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Price per night</p>
                  <p className="font-semibold">{validationUtils.formatCurrency(category?.price_per_night || 0)}</p>
                </div>
              </>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">Total Amount</span>
              <span className="text-3xl font-bold text-primary-main">
                {validationUtils.formatCurrency(calculateTotal())}
              </span>
            </div>
            {selectedRooms.length > 0 && checkInDate && checkOutDate && (
              <p className="text-sm text-gray-500 mt-2 text-right">
                {selectedRooms.length} room(s) × {nights} night(s) × {validationUtils.formatCurrency(category?.price_per_night || 0)}
              </p>
            )}
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
  );
}