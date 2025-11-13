import React from 'react';
import { Tag, Sparkles, Calendar } from 'lucide-react';
import { Button } from '@common/Button';
import { getImageUrl } from '@services/api/api.js';
import validationUtils from '@services/utils/validation.js';

export default function CategoryResultCard({ 
  category, 
  hasOffer, 
  originalPrice, 
  discountedPrice, 
  savingsPerNight, 
  onSelectCategory 
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {category.room_catagory_name}
            </h2>
            <p className="text-gray-200 text-sm">
              {category.available_rooms.length} room(s) available
            </p>
          </div>
          {hasOffer && (
            <div className="bg-red-600 px-4 py-2 rounded-full font-bold flex items-center gap-2">
              <Tag className="w-5 h-5" />
              {category.offered_discount}% OFF
            </div>
          )}
        </div>
      </div>

      {/* Offer Banner */}
      {hasOffer && category.offer_name && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-bold text-orange-900">{category.offer_name}</h3>
          </div>
          {category.offer_description && (
            <p className="text-orange-700 text-sm">{category.offer_description}</p>
          )}
          <p className="text-green-700 font-semibold text-sm mt-2">
            Save {validationUtils.formatCurrency(savingsPerNight)} per night!
          </p>
        </div>
      )}

      {/* Category Info */}
      <div className="p-6 border-b">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={getImageUrl(category.room_catagory_images)}
            alt={category.room_catagory_name}
            className="w-full md:w-64 h-48 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400';
            }}
          />
          <div className="flex-1">
            <p className="text-gray-600 mb-4">{category.room_catagory_description}</p>
            <div className="flex items-baseline gap-3 mb-4">
              {hasOffer ? (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    {validationUtils.formatCurrency(originalPrice)}
                  </span>
                  <span className="text-3xl font-bold text-green-600">
                    {validationUtils.formatCurrency(discountedPrice)}
                  </span>
                  <span className="text-gray-500">per night</span>
                </>
              ) : (
                <>
                  <span className="text-3xl font-bold text-primary-main">
                    {validationUtils.formatCurrency(originalPrice)}
                  </span>
                  <span className="text-gray-500">per night</span>
                </>
              )}
            </div>
            <Button onClick={onSelectCategory} icon={Calendar}>
              Select Rooms from this Category
            </Button>
          </div>
        </div>
      </div>

      {/* Available Rooms List */}
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Available Rooms:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {category.available_rooms.map((room) => (
            <div
              key={room.room_id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <img
                src={getImageUrl(room.room_images)}
                alt={`Room ${room.room_no}`}
                className="w-full h-32 object-cover rounded mb-3"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=300';
                }}
              />
              <h4 className="font-semibold text-lg mb-2">Room {room.room_no}</h4>
              <p className="text-sm text-gray-600 mb-2">
                Capacity: {room.capacity} guests
              </p>
              <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                Available
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}