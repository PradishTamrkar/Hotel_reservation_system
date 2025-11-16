import React from 'react';
import { Users, CheckCircle, XCircle, Tag } from 'lucide-react';
import { Button } from '@common/Button';
import { Card } from '@common/Card';
import { getImageUrl } from '@services/api/api.js';
import validationUtils from '@services/utils/validation.js';

export default function RoomCard({
  room,
  isSelected,
  hasOffer,
  discountAmount,
  originalPrice,
  discountedPrice,
  savingsPerNight,
  onSelect
}) {
  const isAvailable = room.room_status === 'Available';

  return (
    <Card
      className={`overflow-hidden cursor-pointer transition-all ${
        isSelected
          ? 'ring-2 ring-primary-main shadow-lg'
          : isAvailable
          ? 'hover:shadow-md'
          : 'opacity-75'
      }`}
      onClick={() => onSelect(room.room_id, isAvailable)}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative md:w-2/5 h-64 md:h-auto">
          <img
            src={getImageUrl(room.room_images)}
            alt={`Room ${room.room_no}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400';
            }}
          />
          {!isAvailable ? (
            <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">
              ROOM BOOKED
            </div>
          ) : hasOffer && (
            <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {discountAmount}% OFF
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="md:w-3/5 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Room {room.room_no}
            </h3>
            
            {/* Room Description - Always show */}
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              {room.room_description || 'Comfortable room with modern amenities and excellent service.'}
            </p>

            {/* Capacity */}
            <div className="flex items-center gap-2 text-gray-700 mb-4">
              <Users className="w-5 h-5" />
              <span>Capacity: {room.capacity} guests</span>
            </div>

            {/* Status Badge */}
            <div className="mb-4">
              {isAvailable ? (
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>Available</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                  <XCircle className="w-4 h-4" />
                  <span>Unavailable</span>
                </div>
              )}
            </div>
          </div>

          {/* Price Section with Discount - UPDATED */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div>
              <p className="text-sm text-gray-500">Rates from</p>
              {hasOffer ? (
                <div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-lg text-gray-400 line-through">
                      {validationUtils.formatCurrency(originalPrice)}
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      {validationUtils.formatCurrency(discountedPrice)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">per night</p>
                  {/* REMOVED: Save Rs line */}
                </div>
              ) : (
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {validationUtils.formatCurrency(originalPrice)}
                  </p>
                  <p className="text-sm text-gray-500">per night</p>
                </div>
              )}
            </div>
            {isAvailable && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(room.room_id, isAvailable);
                }}
                className={`whitespace-nowrap ${isSelected ? 'bg-orange-500 hover:bg-orange-700 text-white' : ''}`}
              >
                {isSelected ? 'Selected' : 'Select Room'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}