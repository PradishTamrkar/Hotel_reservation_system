import React from 'react';
import { Calendar, Hotel, CreditCard, XCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@common/Card';
import { Button } from '@common/Button';
import validationUtils from '@services/utils/validation.js';

export default function BookingHistoryList({ bookings, onCancelBooking }) {
  const getBookingStatus = (checkInDate, checkOutDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkOut < today) {
      return {
        label: 'Completed',
        color: 'bg-gray-100 text-gray-700',
        icon: CheckCircle,
      };
    } else if (checkIn <= today && checkOut >= today) {
      return {
        label: 'Active',
        color: 'bg-green-100 text-green-700',
        icon: AlertCircle,
      };
    } else {
      return {
        label: 'Upcoming',
        color: 'bg-blue-100 text-blue-700',
        icon: Calendar,
      };
    }
  };

  return (
    <div className="space-y-6">
      {bookings.map((booking) => {
        const status = getBookingStatus(booking.check_in_date, booking.check_out_date);
        const canCancel = new Date(booking.check_in_date) > new Date();
        const nights = validationUtils.calculateNights(
          booking.check_in_date,
          booking.check_out_date
        );
        const StatusIcon = status.icon;

        return (
          <Card key={booking.booking_id} className="overflow-hidden">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Booking #{booking.booking_id}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Booked on {validationUtils.formatDate(booking.booking_date)}
                  </p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  <span className="font-semibold text-sm">{status.label}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Dates Section */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Check-in */}
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Check-in</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {validationUtils.formatDate(booking.check_in_date)}
                        </p>
                      </div>
                    </div>

                    {/* Check-out */}
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Check-out</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {validationUtils.formatDate(booking.check_out_date)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Hotel className="w-5 h-5 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">Room Details</h4>
                    </div>
                    <div className="space-y-2">
                      {booking.room_details?.map((room, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {room.room_catagory_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Room {room.room_no} • {validationUtils.formatCurrency(room.price_per_night)} per night
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {nights} night{nights > 1 ? 's' : ''} • {booking.room_details?.length || 0} room{booking.room_details?.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Total & Actions Section */}
                <div className="lg:col-span-1 flex flex-col justify-between">
                  <div className="bg-primary/5 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <p className="text-sm text-gray-600">Total Amount</p>
                    </div>
                    <p className="text-3xl font-bold text-primary">
                      {validationUtils.formatCurrency(booking.total_amount)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    {canCancel && (
                      <Button
                        variant="danger"
                        className="w-full"
                        icon={XCircle}
                        onClick={() => onCancelBooking(booking.booking_id, booking.check_in_date)}
                      >
                        Cancel Booking
                      </Button>
                    )}
                    {!canCancel && status.label === 'Completed' && (
                      <div className="text-center text-sm text-gray-500 py-2">
                        This booking has been completed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}