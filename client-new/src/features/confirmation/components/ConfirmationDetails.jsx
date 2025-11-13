import React from 'react';
import { Calendar, Hotel as HotelIcon, Receipt } from 'lucide-react';
import validationUtils from '@services/utils/validation.js';

export default function ConfirmationDetails({ bookingDetails }) {
  const nights = validationUtils.calculateNights(
    bookingDetails.check_in_date,
    bookingDetails.check_out_date
  );

  const detailItems = [
    {
      icon: Calendar,
      title: 'Stay Details',
      content: (
        <>
          <p className="text-sm text-gray-600">
            Check-in: {validationUtils.formatDate(bookingDetails.check_in_date)}
          </p>
          <p className="text-sm text-gray-600">
            Check-out: {validationUtils.formatDate(bookingDetails.check_out_date)}
          </p>
          <p className="text-sm text-gray-600">
            {nights} night{nights > 1 ? 's' : ''}
          </p>
        </>
      )
    },
    {
      icon: HotelIcon,
      title: 'Rooms',
      content: (
        <p className="text-sm text-gray-600">
          {bookingDetails.rooms.length} room{bookingDetails.rooms.length > 1 ? 's' : ''} booked
        </p>
      )
    },
    {
      icon: Receipt,
      title: 'Total Amount',
      content: (
        <p className="text-2xl font-bold text-primary-main">
          {validationUtils.formatCurrency(bookingDetails.total_amount)}
        </p>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {detailItems.map((item, index) => (
        <div key={index} className="flex items-start gap-3">
          <item.icon className="w-6 h-6 text-primary-main flex-shrink-0 mt-1" />
          <div>
            <p className="font-semibold mb-1">{item.title}</p>
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
}