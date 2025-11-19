import React from 'react';
import { ShoppingCart, Calendar, Tag, AlertCircle } from 'lucide-react';
import { Button } from '@common/Button';
import { Card } from '@common/Card';
import validationUtils from '@services/utils/validation.js';

export default function BookingSummary({
  category,
  selectedRooms,
  checkInDate,
  checkOutDate,
  hasOffer,
  originalPrice,
  discountedPrice,
  calculateTotal,
  calculateTotalSavings,
  onProceedToBooking
}) {
  const nights = checkInDate && checkOutDate ? validationUtils.calculateNights(checkInDate, checkOutDate) : 0;
  const total = calculateTotal();
  const savings = calculateTotalSavings();
  const canProceed = selectedRooms.length > 0 && checkInDate && checkOutDate;

  return (
    <>
      {/* Desktop Sticky Card */}
      <div className="hidden lg:block sticky top-24">
        <Card className="p-6 shadow-xl border-2 border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b">
            Booking Summary
          </h2>

          {/* Category Info */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Category</span>
              <span className="font-semibold text-gray-900 text-right">
                {category?.room_catagory_name}
              </span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Selected Rooms</span>
              <span className="font-semibold text-gray-900">
                {selectedRooms.length} room{selectedRooms.length !== 1 ? 's' : ''}
              </span>
            </div>

            {checkInDate && checkOutDate && (
              <>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Check-in</span>
                  <span className="font-medium text-gray-900">
                    {validationUtils.formatDate(checkInDate)}
                  </span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Check-out</span>
                  <span className="font-medium text-gray-900">
                    {validationUtils.formatDate(checkOutDate)}
                  </span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Number of Nights</span>
                  <span className="font-semibold text-gray-900">{nights}</span>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Price per night</span>
                  </div>
                  {hasOffer ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400 line-through">
                          {validationUtils.formatCurrency(originalPrice)}
                        </span>
                        <div className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">
                          -{category?.offered_discount}% OFF
                        </div>
                      </div>
                      <p className="text-xl font-bold text-green-600 text-right">
                        {validationUtils.formatCurrency(discountedPrice)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xl font-bold text-primary text-right">
                      {validationUtils.formatCurrency(originalPrice)}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Price Calculation */}
          {selectedRooms.length > 0 && checkInDate && checkOutDate && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">
                {selectedRooms.length} room{selectedRooms.length !== 1 ? 's' : ''} × {nights} night{nights !== 1 ? 's' : ''} × {validationUtils.formatCurrency(discountedPrice)}
              </div>
            </div>
          )}

          {/* Savings Banner */}
          {hasOffer && savings > 0 && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Tag className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-800">
                  Special Offer Applied!
                </span>
              </div>
              <p className="text-lg font-bold text-green-700">
                Total Savings: {validationUtils.formatCurrency(savings)}
              </p>
            </div>
          )}

          {/* Total Amount */}
          <div className="border-t pt-6 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xl font-bold text-gray-900">Total Amount</span>
              <span className="text-3xl font-bold text-primary">
                {validationUtils.formatCurrency(total)}
              </span>
            </div>
          </div>

          {/* Warning Message */}
          {!canProceed && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                {selectedRooms.length === 0 
                  ? 'Please select at least one room'
                  : 'Please select check-in and check-out dates'}
              </p>
            </div>
          )}

          {/* CTA Button */}
          <Button
            className="w-full py-4 text-lg font-semibold"
            icon={ShoppingCart}
            onClick={onProceedToBooking}
            disabled={!canProceed}
          >
            Proceed to Booking
          </Button>

          {/* Trust Badges */}
          <div className="mt-4 pt-4 border-t text-center">
            <p className="text-xs text-gray-500">
              ✓ Secure booking · ✓ Instant confirmation
            </p>
          </div>
        </Card>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 shadow-2xl p-4 z-40">
        <div className="space-y-3">
          {/* Summary Row */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">
                {selectedRooms.length} room{selectedRooms.length !== 1 ? 's' : ''} · {nights} night{nights !== 1 ? 's' : ''}
              </p>
              <div className="flex items-baseline gap-2">
                {hasOffer && (
                  <span className="text-sm text-gray-400 line-through">
                    {validationUtils.formatCurrency(originalPrice * selectedRooms.length * nights)}
                  </span>
                )}
                <span className="text-2xl font-bold text-primary">
                  {validationUtils.formatCurrency(total)}
                </span>
              </div>
            </div>
            <Button
              icon={ShoppingCart}
              onClick={onProceedToBooking}
              disabled={!canProceed}
              className="flex-shrink-0"
            >
              Book Now
            </Button>
          </div>

          {/* Warning on Mobile */}
          {!canProceed && (
            <div className="p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              <span>
                {selectedRooms.length === 0 
                  ? 'Select rooms to continue'
                  : 'Select dates to continue'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Spacer for mobile bottom bar */}
      <div className="lg:hidden h-24"></div>
    </>
  );
}