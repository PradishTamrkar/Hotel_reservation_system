import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function ConfirmationHeader({ bookingId }) {
  return (
    <div className="text-center mb-8">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
      <p className="text-gray-600">Your reservation has been successfully created</p>
      <div className="mt-4 inline-block bg-green-100 text-green-800 px-4 py-2 rounded-lg">
        <strong>Booking ID:</strong> {bookingId}
      </div>
    </div>
  );
}