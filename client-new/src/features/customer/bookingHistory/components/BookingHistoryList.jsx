import React, { useState } from 'react';
import { Trash2, User, Calendar, Mail, DoorOpen, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { Card } from '@common/Card';
import { Button } from '@common/Button';
import { TestimonialModal } from '@common/TestimonialModal';
import validationUtils from '@services/utils/validation';

export default function BookingHistoryList({ bookings, onCancelBooking }) {
  const [expandedId, setExpandedId] = useState(null);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [reviewedBookings, setReviewedBookings] = useState(new Set());

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

  const handleWriteReview = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowTestimonialModal(true);
  };

  const handleReviewSuccess = (bookingId) => {
    setReviewedBookings(prev => new Set(prev).add(bookingId));
  };

  return (
    <>
      <div className="space-y-4">
        {bookings.map((booking) => {
          const status = getStatusText(booking.check_in_date, booking.check_out_date);
          const isCompleted = status === 'Completed';
          const hasReviewed = reviewedBookings.has(booking.booking_id);

          return (
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
                        {status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {validationUtils.formatDate(booking.check_in_date)} - {validationUtils.formatDate(booking.check_out_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DoorOpen className="w-4 h-4 text-gray-400" />
                        <span>{validationUtils.calculateNights(booking.check_in_date, booking.check_out_date)} nights</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-4">
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
                  
                  {booking.room_details && booking.room_details.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Room Details</h4>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="space-y-2">
                          {booking.room_details.map((room, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900">{room.room_catagory_name}</p>
                                <p className="text-sm text-gray-600">Room {room.room_no}</p>
                              </div>
                              <p className="text-sm text-gray-600">
                                {validationUtils.formatCurrency(room.price_per_night)} per night
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    {isCompleted && !hasReviewed && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWriteReview(booking.booking_id);
                        }}
                        icon={Star}
                        variant="secondary"
                        className="flex-1"
                      >
                        Write Review
                      </Button>
                    )}
                    
                    {hasReviewed && (
                      <div className="flex-1 bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-center">
                        <p className="text-sm text-green-700 font-medium">
                          ✓ Review Submitted
                        </p>
                      </div>
                    )}

                    {status === 'Upcoming' && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCancelBooking(booking.booking_id, booking.check_in_date);
                        }}
                        icon={Trash2}
                        variant="danger"
                        className="flex-1"
                      >
                        Cancel Booking
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Testimonial Modal */}
      <TestimonialModal
        isOpen={showTestimonialModal}
        onClose={() => setShowTestimonialModal(false)}
        bookingId={selectedBookingId}
        onSuccess={handleReviewSuccess}
      />
    </>
  );
}