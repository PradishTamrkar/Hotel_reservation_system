import React from 'react';
import { Trash2, Star } from 'lucide-react';
import { Card } from '@common/Card';

export default function TestimonialList({ testimonials, onDelete, onToggleFeatured }) {
  if (testimonials.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">No testimonials yet. Customers can submit reviews after their stay.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.testimony_id} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(testimonial.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {testimonial.rating}
              </span>
            </div>
            <button
              onClick={() => onToggleFeatured(testimonial.testimony_id)}
              className={`flex-shrink-0 p-2 rounded-full transition-colors ${
                testimonial.is_featured
                  ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
              title={testimonial.is_featured ? 'Remove from featured' : 'Mark as featured'}
            >
              <Star
                className={`w-4 h-4 ${testimonial.is_featured ? 'fill-current' : ''}`}
              />
            </button>
          </div>

          <p className="text-gray-600 text-sm mb-4 italic line-clamp-4">
            "{testimonial.comment}"
          </p>

          <div className="border-t pt-4">
            <p className="font-semibold text-gray-900">
              {testimonial.customer_name}
            </p>
            <p className="text-xs text-gray-500">Verified Guest</p>
            {testimonial.is_featured && (
              <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">
                Featured
              </span>
            )}
          </div>

          <div className="mt-4">
            <button
              onClick={() => onDelete(testimonial.testimony_id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}