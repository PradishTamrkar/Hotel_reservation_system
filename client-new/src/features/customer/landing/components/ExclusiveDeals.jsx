import React, { useEffect, useState } from 'react';
import { Loader2, Tag, Sparkles } from 'lucide-react';
import { offerService, getImageUrl } from '@services/api/api';

export const ExclusiveDealsSection = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const data = await offerService.getAll();
        console.log('Offers API Response:', data);
        // Filter only offers with discount > 0
        const validOffers = (data || []).filter(offer => 
          offer.offered_discount && parseFloat(offer.offered_discount) > 0
        );
        setOffers(validOffers);
      } catch (err) {
        console.error('Error fetching offers:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
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

  if (error || offers.length === 0) {
    return null;
  }

  return (
    <section id="exclusivedeals" className="py-20 bg-blue-50">
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

        {/* Offers Horizontal Scroll */}
        <div className="overflow-x-auto overflow-y-hidden pb-4 -mx-4 px-4">
          <div className="flex gap-6 w-max">
            {offers.map((offer) => (
              <div
                key={offer.offer_id}
                className="relative flex-shrink-0 w-[350px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer bg-white"
              >
                {/* Discount Badge - Always Visible */}
                <div className="absolute top-4 right-4 z-10 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 animate-pulse">
                  <Tag className="w-4 h-4" />
                  {offer.offered_discount}% OFF
                </div>

                {/* Offer Image */}
                <div className="relative h-64 overflow-hidden">
                  {offer.offer_image ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                      style={{
                        backgroundImage: `url(${getImageUrl(offer.offer_image)})`,
                      }}
                    />
                  ) : (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                      style={{
                        backgroundImage: `url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800)`,
                      }}
                    />
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>

                {/* Content - Fixed Height Container */}
                <div className="p-6 flex flex-col h-[220px]">
                  {/* Top Section */}
                  <div className="flex-1">
                    {/* Offer Name Badge */}
                    <div className="h-10 mb-3 flex items-center">
                      <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-l font-bold">
                        <Sparkles className="w-5 h-5" />
                        {offer.offer_name}
                      </div>
                    </div>

                    {/* Description - Fixed Height */}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3 h-[60px]">
                      {offer.offer_description || 'Special limited-time offer! Book now to enjoy amazing discounts on your stay.'}
                    </p>
                  </div>

                  {/* Discount Info - Fixed at Bottom */}
                  <div className="pt-1 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Save up to</p>
                        <p className="text-3xl font-bold text-green-600">
                          {offer.offered_discount}%
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold text-sm shadow-lg" >
                        Limited Time
                      </div>
                    </div>
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