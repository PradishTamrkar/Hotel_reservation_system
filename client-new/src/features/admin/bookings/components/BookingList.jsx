import React, { useState } from 'react';
import { Trash2, User, Calendar, Mail, DoorOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@common/Card';
import validationUtils from '@services/utils/validation';

export default function BookingList({ bookings, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);

  if (bookings.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">No bookings found</p>
      </Card>
    );
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusColor = (checkInDate) => {
    const today = new Date();
    const checkIn = new Date(checkInDate);
    
    if (checkIn < today) {
      return 'bg-gray-100 text-gray-700';
    } else if (checkIn.toDateString() === today.toDateString()) {
      return 'bg-green-100 text-green-700';
    } else {
      return 'bg-blue-100 text-blue-700';
    }
  };

  const getStatusText = (checkInDate, checkOutDate) => {
    const today = new Date();
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    if (checkOut < today) return 'Completed';
    if (checkIn <= today && checkOut >= today) return 'Active';
    return 'Upcoming';
  };

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.booking_id} className="overflow-hidden">
          <div
            className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleExpand(booking.booking_id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-semibold text-gray-500">
                    Booking #{booking.booking_id}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(booking.check_in_date)}`}>
                    {getStatusText(booking.check_in_date, booking.check_out_date)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{booking.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{booking.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>
                      {validationUtils.formatDate(booking.check_in_date)} - {validationUtils.formatDate(booking.check_out_date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <DoorOpen className="w-4 h-4 text-gray-400" />
                    <span>{validationUtils.calculateNights(booking.check_in_date, booking.check_out_date)} nights</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(booking.booking_id);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete booking"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                {expandedId === booking.booking_id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {expandedId === booking.booking_id && (
            <div className="px-6 pb-6 border-t border-gray-200 pt-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Booking Date</h4>
                  <p className="text-gray-600">{validationUtils.formatDate(booking.booking_date)}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Total Amount</h4>
                  <p className="text-2xl font-bold text-primary">
                    {validationUtils.formatCurrency(booking.total_amount)}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                <div className="bg-white p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <p><span className="font-medium">Name:</span> {booking.customer_name}</p>
                    <p><span className="font-medium">Email:</span> {booking.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}