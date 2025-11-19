import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, ArrowRight } from 'lucide-react';
import { Button } from '@common/Button';
import { formatters } from '@services/utils/formatters';

export const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  const hasOffer = room.offer_id && room.offered_discount;
  const originalPrice = parseFloat(room.price_per_night);
  const discountedPrice = hasOffer 
    ? originalPrice * (1 - room.offered_discount / 100) 
    : originalPrice;

  return (
    <div
      className="group relative flex-shrink-0 w-[350px] bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
      onClick={() => navigate(`/roomCatagory/${room.room_catagory_id}`)}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{
            backgroundImage: `url(${room.room_catagory_images})`,
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Offer Badge */}
        {hasOffer && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-2 rounded-full font-bold flex items-center gap-1 shadow-lg text-sm z-10">
            <Tag className="w-4 h-4" />
            {room.offered_discount}% OFF
          </div>
        )}

        {/* Category Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
            {room.room_catagory_name}
          </h3>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 flex flex-col h-[220px]">
        {/* Top Section - Fixed Height */}
        <div className="flex-1">
          {/* Offer Name - Fixed Height Container */}
          <div className="h-7 mb-2">
            {room.offer_name && (
              <div className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                {room.offer_name}
              </div>
            )}
          </div>

          {/* Description - Fixed Height */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">
            {room.room_catagory_description}
          </p>
        </div>
        
        {/* Price Section - Fixed Height */}
        <div className="h-20 flex flex-col justify-center mb-3">
          {hasOffer ? (
            <>
              <span className="text-xs text-gray-400 line-through mb-1">
                {formatters.currency(originalPrice)}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-green-600 leading-none">
                  {formatters.currency(discountedPrice)}
                </span>
                <span className="text-gray-500 text-sm">/night</span>
              </div>
            </>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900 leading-none">
                {formatters.currency(originalPrice)}
              </span>
              <span className="text-gray-500 text-sm">/night</span>
            </div>
          )}
        </div>

        {/* CTA Button - Fixed at Bottom */}
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/roomCatagory/${room.room_catagory_id}`);
          }}
          className="w-full group/btn mt-auto"
        >
          View Details
          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary rounded-2xl transition-all duration-300 pointer-events-none" />
    </div>
  );
};