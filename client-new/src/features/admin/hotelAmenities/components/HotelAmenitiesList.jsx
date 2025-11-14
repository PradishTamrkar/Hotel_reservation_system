import React from "react";
import { Edit2,Trash2,Tag } from "lucide-react";
import { Card } from '@common/Card'
import { getImageUrl } from '@services/api/api';

export default function HotelAmenitiesList({ hotelAmenities,onEdit,onDelete }) {
    if(hotelAmenities.length === 0){
        return (
              <Card className="p-8 text-center">
                <p className="text-gray-500">No hotel amenities found!</p>
              </Card>
            );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotelAmenities.map((hotelAmenity) => (
                <Card key={hotelAmenity.hotel_amenity_id} className="overflow-hidden">
                    <div className="relative h-48">
                        <img
                           src={getImageUrl(hotelAmenity.hotel_amenity_image)}
                           alt={hotelAmenity.hotel_amenity_name}
                           className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="p-4">
                        <h3 className="text-xl font-bold mb-2">{hotelAmenity.hotel_amenity_name}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {hotelAmenity.hotel_amenity_description || 'No description'}
                        </p>
                    </div>
                </Card>
            ))}
        </div>
    )
}