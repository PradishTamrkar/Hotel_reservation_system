import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@common/Button';
import { Card } from '@common/Card';
import { roomService } from '@services/api/api.js';
import validationUtils from '@services/utils/validation.js';
import toast from 'react-hot-toast';

import SearchResultsHeader from '@features/customer/search/components/SearchResultsHeader';
import SearchResultsSummary from '@features/customer/search/components/SearchResultSummary';
import CategoryResultCard from '@features/customer/search/components/CategoryResultCard';

export default function SearchRoomResultPage() {
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
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className='text-lg text-gray-600'>Searching Rooms...</p>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <SearchResultsHeader 
          checkIn={checkIn}
          checkOut={checkOut}
          onBack={() => navigate('/')}
        />

        <SearchResultsSummary 
          totalRooms={results.total_available_rooms}
          totalCategories={results.total_categories}
        />

        <div className="space-y-12">
          {results.categories.map((category) => {
            const hasOffer = category.offer_id && category.offered_discount;
            const originalPrice = parseFloat(category.price_per_night);
            const discountedPrice = hasOffer 
              ? originalPrice * (1 - category.offered_discount / 100) 
              : originalPrice;
            const savingsPerNight = hasOffer ? originalPrice - discountedPrice : 0;

            return (
              <CategoryResultCard
                key={category.room_catagory_id}
                category={category}
                hasOffer={hasOffer}
                originalPrice={originalPrice}
                discountedPrice={discountedPrice}
                savingsPerNight={savingsPerNight}
                onSelectCategory={() => navigate(`/rooms/category/${category.room_catagory_id}`, {
                  state: { checkIn, checkOut }
                })}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
