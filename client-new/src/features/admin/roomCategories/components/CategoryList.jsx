import React from 'react';
import { Edit2, Trash2, Tag } from 'lucide-react';
import { Card } from '@common/Card';
import { getImageUrl } from '@services/api/api';
import validationUtils from '@services/utils/validation';

export default function CategoryList({ categories, onEdit, onDelete }) {
  if (categories.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">No categories found. Create your first category!</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Card key={category.room_catagory_id} className="overflow-hidden">
          <div className="relative h-48">
            <img
              src={getImageUrl(category.room_catagory_images)}
              alt={category.room_catagory_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400';
              }}
            />
            {category.offer_id && (
              <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {category.offered_discount}% OFF
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">{category.room_catagory_name}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {category.room_catagory_description || 'No description'}
            </p>
            
            <div className="mb-4">
              <p className="text-2xl font-bold text-primary">
                {validationUtils.formatCurrency(category.price_per_night)}
                <span className="text-sm text-gray-500 font-normal"> / night</span>
              </p>
              {category.offer_id && (
                <p className="text-sm text-green-600 font-semibold">
                  {category.offer_name}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(category)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => onDelete(category.room_catagory_id)}
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