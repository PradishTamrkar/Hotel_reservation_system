import React from 'react';
import { Card } from '@common/Card';
import validationUtils from '@services/utils/validation.js';

export default function BookingSummarySidebar({ bookingData }) {
  const nights = validationUtils.calculateNights(
    bookingData.check_in_date,
    bookingData.check_out_date
  );

  return (
    <Card className="p-6 sticky top-6">
      <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
      
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500">Check-in</p>
          <p className="font-medium">
            {validationUtils.formatDate(bookingData.check_in_date)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Check-out</p>
          <p className="font-medium">
            {validationUtils.formatDate(bookingData.check_out_date)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Nights</p>
          <p className="font-medium">{nights} night{nights > 1 ? 's' : ''}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Rooms</p>
          <p className="font-medium">
            {bookingData.rooms.length} room{bookingData.rooms.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="border-t mt-6 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-2xl font-bold text-primary-main">
            {validationUtils.formatCurrency(bookingData.total_amount)}
          </span>
        </div>
      </div>
    </Card>
  );
}