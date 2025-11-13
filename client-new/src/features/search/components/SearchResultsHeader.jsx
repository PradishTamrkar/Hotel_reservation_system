import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@common/Button';
import validationUtils from '@services/utils/validation.js';

export default function SearchResultsHeader({ checkIn, checkOut, onBack }) {
  const nights = validationUtils.calculateNights(checkIn, checkOut);

  return (
    <div className="mb-8">
      <Button
        variant="ghost"
        onClick={onBack}
        icon={ArrowLeft}
        className="mb-4"
      >
        Back to Home
      </Button>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        Available Rooms
      </h1>
      <div className="bg-white rounded-lg shadow p-4 inline-block">
        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <span className="text-gray-500">Check-in:</span>{' '}
            <span className="font-semibold">{validationUtils.formatDate(checkIn)}</span>
          </div>
          <div>
            <span className="text-gray-500">Check-out:</span>{' '}
            <span className="font-semibold">{validationUtils.formatDate(checkOut)}</span>
          </div>
          <div>
            <span className="text-gray-500">Nights:</span>{' '}
            <span className="font-semibold">{nights}</span>
          </div>
        </div>
      </div>
    </div>
  );
}