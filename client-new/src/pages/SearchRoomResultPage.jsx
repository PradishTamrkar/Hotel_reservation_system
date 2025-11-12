import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Loader2, Tag, Sparkles } from 'lucide-react';
import { Button } from '@common/Button';
import { Card } from '@common/Card';
import { roomService, getImageUrl } from '@services/api/api.js';
import validationUtils from '@services/utils/validation.js';
import toast from 'react-hot-toast';

export default function SearchRoomsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const checkIn = searchParams.get('check_in');
  const checkOut = searchParams.get('check_out');
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      if (!checkIn || !checkOut) {
        toast.error('Missing date parameters');
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        const data = await roomService.getAvailableByDate(checkIn, checkOut);
        console.log('Available rooms data:', data);
        setResults(data);
      } catch (err) {
        console.error('Error fetching available rooms:', err);
        toast.error(err.message || 'Failed to load available rooms');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableRooms();
  }, [checkIn, checkOut, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary-main" />
      </div>
    );
  }

  if (!results || results.categories.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Available Rooms Found
            </h2>
            <p className="text-gray-600 mb-6">
              Sorry, there are no available rooms for the selected dates.
              Please try different dates.
            </p>
            <div className="space-y-2 text-sm text-gray-500 mb-6">
              <p>Check-in: {validationUtils.formatDate(checkIn)}</p>
              <p>Check-out: {validationUtils.formatDate(checkOut)}</p>
              <p>Nights: {validationUtils.calculateNights(checkIn, checkOut)}</p>
            </div>
            <Button onClick={() => navigate('/')} icon={ArrowLeft}>
              Back to Home
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const nights = validationUtils.calculateNights(checkIn, checkOut);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            icon={ArrowLeft}
            className="mb-4"
          >
            Back to Home
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Available Rooms
          </h1>
          <div className="bg-white rounded-lg shadow p-4 inline-block">
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-gray-500">Check-in:</span>{' '}
                <span className="font-semibold">{validationUtils.formatDate(checkIn)}</span>
              </div>
              <div>
                <span className="text-gray-500">Check-out:</span>{' '}
                <span className="font-semibold">{validationUtils.formatDate(checkOut)}</span>
              </div>
              <div>
                <span className="text-gray-500">Nights:</span>{' '}
                <span className="font-semibold">{nights}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-900">
            <strong>{results.total_available_rooms}</strong> rooms available in{' '}
            <strong>{results.total_categories}</strong> categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="space-y-12">
          {results.categories.map((category) => {
            const hasOffer = category.offer_id && category.offered_discount;
            const originalPrice = parseFloat(category.price_per_night);
            const discountedPrice = hasOffer 
              ? originalPrice * (1 - category.offered_discount / 100) 
              : originalPrice;
            const savingsPerNight = hasOffer ? originalPrice - discountedPrice : 0;

            return (
              <div key={category.room_catagory_id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Category Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        {category.room_catagory_name}
                      </h2>
                      <p className="text-gray-200 text-sm">
                        {category.available_rooms.length} room(s) available
                      </p>
                    </div>
                    {hasOffer && (
                      <div className="bg-red-600 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                        <Tag className="w-5 h-5" />
                        {category.offered_discount}% OFF
                      </div>
                    )}
                  </div>
                </div>

                {/* Offer Banner */}
                {hasOffer && category.offer_name && (
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-5 h-5 text-orange-600" />
                      <h3 className="text-lg font-bold text-orange-900">{category.offer_name}</h3>
                    </div>
                    {category.offer_description && (
                      <p className="text-orange-700 text-sm">{category.offer_description}</p>
                    )}
                    <p className="text-green-700 font-semibold text-sm mt-2">
                      Save {validationUtils.formatCurrency(savingsPerNight)} per night!
                    </p>
                  </div>
                )}

                {/* Category Info */}
                <div className="p-6 border-b">
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={getImageUrl(category.room_catagory_images)}
                      alt={category.room_catagory_name}
                      className="w-full md:w-64 h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400';
                      }}
                    />
                    <div className="flex-1">
                      <p className="text-gray-600 mb-4">{category.room_catagory_description}</p>
                      <div className="flex items-baseline gap-3 mb-4">
                        {hasOffer ? (
                          <>
                            <span className="text-xl text-gray-400 line-through">
                              {validationUtils.formatCurrency(originalPrice)}
                            </span>
                            <span className="text-3xl font-bold text-green-600">
                              {validationUtils.formatCurrency(discountedPrice)}
                            </span>
                            <span className="text-gray-500">per night</span>
                          </>
                        ) : (
                          <>
                            <span className="text-3xl font-bold text-primary-main">
                              {validationUtils.formatCurrency(originalPrice)}
                            </span>
                            <span className="text-gray-500">per night</span>
                          </>
                        )}
                      </div>
                      <Button
                        onClick={() => navigate(`/rooms/category/${category.room_catagory_id}`, {
                          state: { checkIn, checkOut }
                        })}
                        icon={Calendar}
                      >
                        Select Rooms from this Category
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Available Rooms List */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Available Rooms:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.available_rooms.map((room) => (
                      <div
                        key={room.room_id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <img
                          src={getImageUrl(room.room_images)}
                          alt={`Room ${room.room_no}`}
                          className="w-full h-32 object-cover rounded mb-3"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=300';
                          }}
                        />
                        <h4 className="font-semibold text-lg mb-2">Room {room.room_no}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Capacity: {room.capacity} guests
                        </p>
                        <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                          Available
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}