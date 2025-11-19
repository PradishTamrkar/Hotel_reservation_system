import React from "react";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import { Button } from "@common/Button";
import { Card } from "@common/Card";

export default function BookingCard({
  id,
  category,
  hasOffer,
  originalPrice,
  discountedPrice,
  navigate,
  validationUtils,
}) {
  return (
    <div className="lg:sticky lg:top-6">
      <Card className="p-6 shadow-xl border-2 border-gray-100 ">
        {/* Price Section */}
        <div className="mb-6 pb-6 border-b">
          <p className="text-sm text-gray-600 mb-2">Price per night</p>
          {hasOffer ? (
            <>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl text-gray-400 line-through">
                  {validationUtils.formatCurrency(originalPrice)}
                </span>
                <div className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">
                  -{category.offered_discount}%
                </div>
              </div>
              <div className="text-4xl font-bold text-green-600">
                {validationUtils.formatCurrency(discountedPrice)}
              </div>
              <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm font-semibold">
                   Save {validationUtils.formatCurrency(originalPrice - discountedPrice)} per night!
                </p>
              </div>
            </>
          ) : (
            <div className="text-4xl font-bold text-primary">
              {validationUtils.formatCurrency(originalPrice)}
            </div>
          )}
        </div>

        {/* Offer Details */}
        {hasOffer && category.offer_name && (
          <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-start gap-2">
              <Tag className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-orange-900">
                  {category.offer_name}
                </p>
                {category.offer_description && (
                  <p className="text-xs text-orange-700 mt-1">
                    {category.offer_description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <Button
          className="w-full py-4 text-lg font-semibold"
          size="lg"
          icon={Calendar}
          onClick={() => navigate(`/rooms/category/${id}`)}
        >
          View Available Rooms
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        {/* Trust Badge */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            ✓ Secure booking · ✓ Best price guarantee
          </p>
        </div>
      </Card>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl p-4 z-40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600">From</p>
            <div className="flex items-baseline gap-2">
              {hasOffer && (
                <span className="text-sm text-gray-400 line-through">
                  {validationUtils.formatCurrency(originalPrice)}
                </span>
              )}
              <span className="text-2xl font-bold text-primary">
                {validationUtils.formatCurrency(hasOffer ? discountedPrice : originalPrice)}
              </span>
              <span className="text-sm text-gray-600">/night</span>
            </div>
          </div>
          <Button
            icon={Calendar}
            onClick={() => navigate(`/rooms/category/${id}`)}
            className="flex-shrink-0"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}