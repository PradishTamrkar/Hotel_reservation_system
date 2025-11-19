import React from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { Input } from '@common/Input';
import { Card } from '@common/Card';

export default function DateFilter({ 
  checkInDate, 
  checkOutDate, 
  onCheckInChange, 
  onCheckOutChange,
  filteringRooms 
}) {
  return (
    <Card className="p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-gray-900">Select Your Dates</h2>
        {filteringRooms && (
          <Loader2 className="w-4 h-4 animate-spin text-primary ml-2" />
        )}
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Choose your check-in and check-out dates to see available rooms
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-in Date *
          </label>
          <Input
            type="date"
            value={checkInDate}
            onChange={(e) => onCheckInChange(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-out Date *
          </label>
          <Input
            type="date"
            value={checkOutDate}
            onChange={(e) => onCheckOutChange(e.target.value)}
            min={checkInDate || new Date().toISOString().split('T')[0]}
            className="w-full"
            required
          />
        </div>
      </div>

      {checkInDate && checkOutDate && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium">
            ✓ Showing available rooms for your selected dates
          </p>
        </div>
      )}

      {!checkInDate || !checkOutDate ? (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 Select dates to filter available rooms
          </p>
        </div>
      ) : null}
    </Card>
  );
}