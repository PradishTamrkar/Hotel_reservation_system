import React from "react";
import { Tag } from "lucide-react";
import { getImageUrl } from "@services/api/api.js";

export default function CategoryHero({ category, hasOffer }) {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center rounded-2xl"
        style={{
          backgroundImage: `url(${getImageUrl(category.room_catagory_images)})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Offer Badge */}
      {hasOffer && (
        <div className="absolute top-6 right-6 z-10 bg-red-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-2xl flex items-center gap-2 animate-pulse">
          <Tag className="w-5 h-5" />
          {category.offered_discount}% OFF
        </div>
      )}

      {/* Category Title Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-2xl mb-2">
            {category.room_catagory_name}
          </h1>
          {hasOffer && category.offer_name && (
            <div className="inline-flex items-center bg-orange-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
              <Tag className="w-4 h-4 mr-2" />
              {category.offer_name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}