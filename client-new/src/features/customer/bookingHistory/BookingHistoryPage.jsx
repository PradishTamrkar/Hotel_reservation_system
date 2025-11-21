import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@common/Button';
import { Card } from '@common/Card';
import { bookingService } from '@services/api/api.js';
import authUtils from '@services/utils/auth.js';
import toast from 'react-hot-toast';

import BookingHistoryList from './components/BookingHistoryList';

export default function BookingHistoryPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!authUtils.isAuthenticated()) {
      toast.error('Please login to view your booking history');
      navigate('/', { replace: true });
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);

        const currentUser = authUtils.getCurrentUser();

        if(!currentUser || !currentUser.id){
          toast.error('Unable to identify user');
          navigate('/', { replace: true });
          return;
        }

        const data = await bookingService.getByCustomerId(currentUser.id);
        setBookings(data || []);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        toast.error(err.message || 'Failed to load booking history');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const handleCancelBooking = async (bookingId, checkInDate) => {
    // Check if check-in date is in the future
    if (new Date(checkInDate) <= new Date()) {
      toast.error('Cannot cancel past bookings');
      return;
    }

    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.delete(bookingId);
      toast.success('Booking cancelled successfully');
      // Refresh bookings list
      const data = await bookingService.getMyBookings();
      setBookings(data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className='text-lg text-gray-600'>Loading History...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          icon={ArrowLeft}
          className="mb-6"
        >
          Back to Home
        </Button>

        <h1 className="text-4xl font-bold mb-8">My Booking History</h1>

        {bookings.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Bookings Yet
              </h2>
              <p className="text-gray-600 mb-6">
                You haven't made any bookings yet.
              </p>
            </div>
          </Card>
        ) : (
          <BookingHistoryList
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
          />
        )}
      </div>
    </div>
  );
}