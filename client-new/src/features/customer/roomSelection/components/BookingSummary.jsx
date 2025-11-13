import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@common/Button';
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Booking Summary</h2>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">Category</p>
          <p className="font-semibold">{category?.room_catagory_name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Selected Rooms</p>
          <p className="font-semibold">{selectedRooms.length} room(s)</p>
        </div>
        {checkInDate && checkOutDate && (
          <>
            <div>
              <p className="text-sm text-gray-600 mb-1">Check-in</p>
              <p className="font-semibold">{validationUtils.formatDate(checkInDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Check-out</p>
              <p className="font-semibold">{validationUtils.formatDate(checkOutDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Number of Nights</p>
              <p className="font-semibold">{nights}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Price per night</p>
              {hasOffer ? (
                <div>
                  <p className="text-sm text-gray-400 line-through">
                    {validationUtils.formatCurrency(originalPrice)}
                  </p>
                  <p className="font-semibold text-green-600">
                    {validationUtils.formatCurrency(discountedPrice)}
                  </p>
                </div>
              ) : (
                <p className="font-semibold">{validationUtils.formatCurrency(originalPrice)}</p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="border-t border-gray-200 pt-6 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl font-bold">Total Amount</span>
          <span className="text-3xl font-bold text-gray-900">
            {validationUtils.formatCurrency(calculateTotal())}
          </span>
        </div>
        {selectedRooms.length > 0 && checkInDate && checkOutDate && (
          <>
            <p className="text-sm text-gray-500 text-right">
              {selectedRooms.length} room(s) × {nights} night(s) × {validationUtils.formatCurrency(discountedPrice)}
            </p>
            {hasOffer && calculateTotalSavings() > 0 && (
              <div className="mt-3 bg-green-50 border border-green-200 rounded p-3">
                <p className="text-green-800 font-semibold text-center text-sm">
                  🎉 Total Savings: {validationUtils.formatCurrency(calculateTotalSavings())}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <Button
        className="w-full bg-orange-600 hover:bg-orange-900 text-white py-3"
        icon={ShoppingCart}
        onClick={onProceedToBooking}
        disabled={selectedRooms.length === 0 || !checkInDate || !checkOutDate}
      >
        Proceed to Booking
      </Button>
    </div>
  );
}