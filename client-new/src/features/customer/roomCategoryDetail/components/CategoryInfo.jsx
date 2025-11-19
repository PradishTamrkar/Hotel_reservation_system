import React from "react";
import { CheckCircle, Sparkles, Info } from "lucide-react";
import { Card } from "@common/Card";

export default function CategoryInfo({
  category,
  amenities,
  hasOffer,
  originalPrice,
  discountedPrice,
  validationUtils,
}) {
  return (
    <>
      {/* Offer Banner */}
      {hasOffer && (
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-orange-900 mb-2">
                {category.offer_name}
              </h3>
              {category.offer_description && (
                <p className="text-orange-700 mb-3">{category.offer_description}</p>
              )}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="bg-white/80 px-4 py-2 rounded-lg">
                  <span className="text-sm text-gray-600">Original Price</span>
                  <p className="text-lg text-gray-400 line-through font-semibold">
                    {validationUtils.formatCurrency(originalPrice)}
                  </p>
                </div>
                <div className="bg-green-100 px-4 py-2 rounded-lg">
                  <span className="text-sm text-green-800">Discounted Price</span>
                  <p className="text-2xl text-green-700 font-bold">
                    {validationUtils.formatCurrency(discountedPrice)}
                  </p>
                </div>
                <div className="bg-blue-100 px-4 py-2 rounded-lg">
                  <span className="text-sm text-blue-800">You Save</span>
                  <p className="text-xl text-blue-700 font-bold">
                    {validationUtils.formatCurrency(originalPrice - discountedPrice)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Description Section */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900">About This Room</h2>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg">
          {category.room_catagory_description}
        </p>
      </Card>

      {/* Pricing Section (visible only on desktop) */}
      {!hasOffer && (
        <Card className="p-6 hidden lg:block">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">
              {validationUtils.formatCurrency(originalPrice)}
            </span>
            <span className="text-gray-500 text-lg">per night</span>
          </div>
        </Card>
      )}

      {/* Amenities Section */}
      {amenities.length > 0 && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Room Amenities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {amenities.map((amenity) => (
              <div
                key={amenity.room_amenity_id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-900 font-medium">
                    {amenity.room_amenity_name}
                  </span>
                  {amenity.room_amenity_description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {amenity.room_amenity_description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}