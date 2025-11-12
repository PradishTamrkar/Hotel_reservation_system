import React, { useState, useEffect } from 'react';
import { hotelAmenityService, getImageUrl } from '@services/api/api.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardImage, CardContent, CardTitle, CardDescription } from '@common/Card';

export const AmenitiesSection = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const data = await hotelAmenityService.getAll();
        setAmenities(data || []);
      } catch (error) {
        console.error('Error fetching amenities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAmenities();
  }, []);

  if (loading) return null;

  return (
    <section id="amenities" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title">Hotel Amenities</h2>
        <p className="section-subtitle">Experience world-class facilities</p>

        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory">
          {amenities.map((amenity) => (
            <div
              key={amenity.hotel_amenity_id}
              className="relative flex-shrink-0 w-[350px] h-72 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group snap-center"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                style={{
                  backgroundImage: `url(${getImageUrl(amenity.hotel_amenity_image)})`,
                }}
              />
              
              {/* Gradient Overlay - becomes darker on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 group-hover:via-black/60 transition-all duration-300" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-2 transform transition-all duration-300 group-hover:translate-y-[-8px]">
                  {amenity.hotel_amenity_name}
                </h3>
                
                {/* Description - slides up on hover */}
                <p className="text-sm text-gray-200 opacity-90 transform transition-all duration-300 group-hover:opacity-100">
                  {amenity.hotel_amenity_description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};