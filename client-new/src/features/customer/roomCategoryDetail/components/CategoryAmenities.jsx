import React from "react";
import { CheckCircle } from "lucide-react";

export default function CategoryAmenities({ amenities }) {
  if (!amenities.length) return null;

  return (
    <div className="border-t border-gray-200 pt-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Room Amenities</h2>
      <div className="grid grid-cols-2 gap-3">
        {amenities.map((amenity) => (
          <div key={amenity.room_amenity_id} className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-gray-700">{amenity.room_amenity_name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
