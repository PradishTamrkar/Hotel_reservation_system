import React, { useState, useEffect } from 'react';
import { hotelAmenityService, getImageUrl } from '@services/api/api.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardImage, CardContent, CardTitle, CardDescription } from '@components/common/Card';

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

        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
          {amenities.map((amenity) => (
            <Card key={amenity.hotel_amenity_id} className="flex-shrink-0 w-[350px]">
              <CardImage
                src={getImageUrl(amenity.hotel_amenity_image)}
                alt={amenity.hotel_amenity_name}
              />
              <CardContent>
                <CardTitle>{amenity.hotel_amenity_name}</CardTitle>
                <CardDescription>{amenity.hotel_amenity_description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};