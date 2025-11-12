import React from "react";

export default function CategoryPricing({
  category,
  hasOffer,
  originalPrice,
  discountedPrice,
  savings,
  validationUtils,
}) {
  return (
    <div className="mb-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {category.room_catagory_name}
      </h1>

      <div className="flex items-baseline gap-3 flex-wrap">
        {hasOffer ? (
          <>
            <span className="text-2xl text-gray-400 line-through">
              {validationUtils.formatCurrency(originalPrice)}
            </span>
            <span className="text-4xl font-bold text-green-600">
              {validationUtils.formatCurrency(discountedPrice)}
            </span>
            <span className="text-gray-500">per night</span>
            <div className="w-full mt-2">
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                You save {validationUtils.formatCurrency(savings)} per night!
              </span>
            </div>
          </>
        ) : (
          <>
            <span className="text-4xl font-bold text-primary-main">
              {validationUtils.formatCurrency(originalPrice)}
            </span>
            <span className="text-gray-500">per night</span>
          </>
        )}
      </div>
    </div>
  );
}
