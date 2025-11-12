import React from 'react';
import { Tag, Sparkles } from 'lucide-react';
import { Card } from '@common/Card';
import validationUtils from '@services/utils/validation.js';

export default function RoomSelectionHeader({ category, hasOffer, savingsPerNight }) {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Select Rooms - {category?.room_catagory_name}
        </h1>
        {hasOffer && (
          <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm">
            <Tag className="w-4 h-4" />
            {category.offered_discount}% OFF
          </div>
        )}
      </div>

      {/* Special Offer Banner */}
      {hasOffer && category.offer_name && (
        <Card className="mb-8 bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-bold text-orange-900">{category.offer_name}</h3>
          </div>
          {category.offer_description && (
            <p className="text-sm text-orange-700 mb-1">{category.offer_description}</p>
          )}
          <p className="text-sm text-green-700 font-semibold">
            Save {validationUtils.formatCurrency(savingsPerNight)} per room, per night!
          </p>
        </Card>
      )}
    </>
  );
}