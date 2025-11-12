// client-new/src/components/features/deals/ExclusiveDealsSection.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Tag, Sparkles } from 'lucide-react';
import { roomCategoryService, getImageUrl } from '@services/api/api';

export const ExclusiveDealsSection = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExclusiveDeals = async () => {
      try {
        setLoading(true);
        const data = await roomCategoryService.getExclusiveDeals();
        console.log('Exclusive Deals API Response:', data);
        setDeals(data?.roomCategory || []);
      } catch (err) {
        console.error('Error fetching exclusive deals:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExclusiveDeals();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (error || deals.length === 0) {
    return null;
  }

  return (
    <section id= "exclusivedeals" className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-orange-500" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Exclusive Deals
            </h2>
            <Sparkles className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these limited-time offers and special promotions
          </p>
        </div>

        {/* Deals Horizontal Scroll */}
        <div className="overflow-x-auto overflow-y-hidden pb-4 -mx-4 px-4">
          <div className="flex gap-6 w-max">
            {deals.map((deal) => (
              <div
                key={deal.room_catagory_id}
                onClick={() => navigate(`/roomCatagory/${deal.room_catagory_id}`)}
                className="relative flex-shrink-0 w-[350px] h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
              >
                {/* Discount Badge - Always Visible */}
                <div className="absolute top-4 right-4 z-10 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  {deal.offered_discount}% OFF
                </div>

                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                  style={{
                    backgroundImage: `url(${getImageUrl(deal.room_catagory_images)})`,
                  }}
                />

                {/* Gradient Overlay - becomes darker on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent group-hover:from-black/90 group-hover:via-black/60 transition-all duration-300" />

                {/* Content - appears on hover */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  {/* Offer Name Badge */}
                  <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold mb-3 w-fit opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <Sparkles className="w-3 h-3" />
                    {deal.offer_name}
                  </div>

                  {/* Category Name */}
                  <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {deal.room_catagory_name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-200 mb-3 line-clamp-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {deal.room_catagory_description}
                  </p>

                  {/* Offer Description */}
                  {deal.offer_description && (
                    <p className="text-orange-300 text-xs italic mb-3 line-clamp-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
                      "{deal.offer_description}"
                    </p>
                  )}

                  {/* Price Section */}
                  <div className="flex items-center justify-between opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-gray-300 line-through text-sm">
                          Rs {parseFloat(deal.price_per_night).toLocaleString('en-NP')}
                        </span>
                        <span className="text-2xl font-bold text-white drop-shadow-lg">
                          Rs {(parseFloat(deal.price_per_night) * (1 - deal.offered_discount / 100)).toLocaleString('en-NP', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <p className="text-green-400 text-xs font-semibold">
                        Save Rs {(parseFloat(deal.price_per_night) * (deal.offered_discount / 100)).toLocaleString('en-NP', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg text-sm whitespace-nowrap">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 text-lg">
            Limited time offers! Book now to secure these amazing deals
          </p>
        </div>
      </div>
    </section>
  );
};