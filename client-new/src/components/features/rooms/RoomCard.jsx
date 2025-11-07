import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@components/common/Button';
import { formatters } from '@services/utils/formatters';

export const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex-shrink-0 w-[350px] h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{
          backgroundImage: `url(${room.room_catagory_images})`,
        }}
      />

      {/* Gradient Overlay - subtle at first, stronger on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent group-hover:from-black/90 group-hover:via-black/40 transition-all duration-300" />

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        {/* Title - Always visible */}
        <h3 className="text-2xl font-bold text-white mb-4 line-clamp-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          {room.room_catagory_name}
        </h3>

        {/* Description - Fades in on hover */}
        <p className="text-sm text-gray-200 mb-4 line-clamp-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          {room.room_catagory_description}
        </p>
        
        {/* Price and Button - Slides up and fades in on hover */}
        <div className="flex items-center justify-between opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
          <div>
            <span className="text-3xl font-bold text-white drop-shadow-lg">
              {formatters.currency(room.price_per_night)}
            </span>
            <span className="text-gray-200 text-sm ml-1">/night</span>
          </div>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click when clicking button
              navigate(`/roomCatagory/${room.room_catagory_id}`);
            }}
            className="shadow-lg"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};