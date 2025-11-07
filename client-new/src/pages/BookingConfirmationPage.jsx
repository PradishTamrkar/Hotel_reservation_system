import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Home, Receipt, Calendar, Hotel as HotelIcon } from 'lucide-react';
import { Button } from '@components/common/Button';
import { Card } from '@components/common/Card';
import validationUtils from '@services/utils/validation.js';

export default function BookingConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;
  const bookingDetails = location.state?.bookingDetails;

  if (!booking || !bookingDetails) {
    navigate('/');
    return null;
  }

  const nights = validationUtils.calculateNights(
    bookingDetails.check_in_date,
    bookingDetails.check_out_date
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your reservation has been successfully created</p>
          <div className="mt-4 inline-block bg-green-100 text-green-800 px-4 py-2 rounded-lg">
            <strong>Booking ID:</strong> {booking.booking_id}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-start gap-3">
            <Calendar className="w-6 h-6 text-primary-main flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold mb-1">Stay Details</p>
              <p className="text-sm text-gray-600">Check-in: {validationUtils.formatDate(bookingDetails.check_in_date)}</p>
              <p className="text-sm text-gray-600">Check-out: {validationUtils.formatDate(bookingDetails.check_out_date)}</p>
              <p className="text-sm text-gray-600">{nights} night{nights > 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <HotelIcon className="w-6 h-6 text-primary-main flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold mb-1">Rooms</p>
              <p className="text-sm text-gray-600">{bookingDetails.rooms.length} room{bookingDetails.rooms.length > 1 ? 's' : ''} booked</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Receipt className="w-6 h-6 text-primary-main flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-primary-main">
                {validationUtils.formatCurrency(bookingDetails.total_amount)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800">
          A confirmation email has been sent to <strong>{bookingDetails.customerInfo.email}</strong>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            icon={Home}
            className="flex-1"
          >
            Back to Home
          </Button>
          <Button
            onClick={() => navigate('/booking/history')}
            icon={Receipt}
            className="flex-1"
          >
            View My Bookings
          </Button>
        </div>
      </Card>
    </div>
  );
}