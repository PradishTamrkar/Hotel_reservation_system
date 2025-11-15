import React, { useState, useEffect } from 'react';
import { Loader2, Calendar, Info } from 'lucide-react';
import { Card } from '@common/Card';
import { bookingService } from '@services/api/api';
import toast from 'react-hot-toast';

import BookingList from './components/BookingList';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAll();
      setBookings(data || []);
    } catch (error) {
      toast.error('Failed to load bookings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }

    try {
      await bookingService.delete(id);
      toast.success('Booking deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to delete booking');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-gray-600 mt-1">View and manage all bookings</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-lg">
          <Calendar className="w-5 h-5" />
          <span className="font-semibold">{bookings.length} Total Bookings</span>
        </div>
      </div>

      <Card className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Booking Management</h3>
            <p className="text-blue-800 text-sm">
              View all customer bookings, check-in/check-out dates, and room details. 
              Only past bookings or those with special permissions can be deleted.
            </p>
          </div>
        </div>
      </Card>

      <BookingList
        bookings={bookings}
        onDelete={handleDelete}
      />
    </div>
  );
}