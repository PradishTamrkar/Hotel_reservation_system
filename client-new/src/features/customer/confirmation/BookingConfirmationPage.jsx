import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Receipt } from 'lucide-react';
import { Button } from '@common/Button';
import { Card } from '@common/Card';

import ConfirmationHeader from '@features/customer/confirmation/components/ConfirmationHeader';
import ConfirmationDetails from '@features/customer/confirmation/components/ConfirmationDetails';

export default function BookingConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;
  const bookingDetails = location.state?.bookingDetails;

  if (!booking || !bookingDetails) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4">
      <Card className="max-w-2xl w-full p-8">
        <ConfirmationHeader bookingId={booking.booking_id} />
        
        <ConfirmationDetails bookingDetails={bookingDetails} />
        
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