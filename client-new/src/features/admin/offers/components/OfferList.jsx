import React from 'react';
import { Edit2, Trash2, Tag } from 'lucide-react';
import { Card } from '@common/Card';
import { getImageUrl } from '@services/api/api';

export default function OfferList({ offers, onEdit, onDelete }) {
  if (offers.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">No offers found. Create your first offer!</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {offers.map((offer) => (
        <Card key={offer.offer_id} className="overflow-hidden">
          {offer.offer_image && (
            <div className="relative h-48">
              <img
                src={getImageUrl(offer.offer_image)}
                alt={offer.offer_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400';
                }}
              />
              <div className="absolute top-3 right-3 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg flex items-center gap-2">
                <Tag className="w-5 h-5" />
                {offer.offered_discount}% OFF
              </div>
            </div>
          )}

          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">{offer.offer_name}</h3>
            
            {!offer.offer_image && (
              <div className="mb-3 bg-red-100 text-red-800 px-3 py-2 rounded font-bold text-center">
                {offer.offered_discount}% Discount
              </div>
            )}

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {offer.offer_description || 'No description provided'}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(offer)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => onDelete(offer.offer_id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}