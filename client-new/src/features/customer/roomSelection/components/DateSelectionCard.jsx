import React from 'react';
import { Input } from '@common/Input';

export default function DateSelection({ checkInDate, checkOutDate, onCheckInChange, onCheckOutChange }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <h2 className="text-xl font-bold mb-6 text-center">Select Your Dates</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
          <Input
            type="date"
            value={checkInDate}
            onChange={(e) => onCheckInChange(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
          <Input
            type="date"
            value={checkOutDate}
            onChange={(e) => onCheckOutChange(e.target.value)}
            min={checkInDate || new Date().toISOString().split('T')[0]}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}