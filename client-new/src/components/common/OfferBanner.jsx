// src/components/common/OfferBanner.jsx
import React from 'react';
import { Sparkles } from 'lucide-react';
import { Card } from '@common/Card';

export const OfferBanner = ({ offerName, offerDescription, discount, savingsText }) => {
  if (!offerName && !discount) return null;

  return (
    <Card className="mb-8 bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-6">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-6 h-6 text-orange-600" />
        <h3 className="text-xl font-bold text-orange-900">
          {offerName || `${discount}% OFF`}
        </h3>
      </div>

      {offerDescription && <p className="text-orange-700">{offerDescription}</p>}
      {savingsText && (
        <p className="text-green-700 font-semibold mt-2">
          {savingsText}
        </p>
      )}
    </Card>
  );
};
