import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@components/common/Button';
import { roomCategoryService, roomAmenityService, getImageUrl } from '@services/api/api.js';
import validationUtils from '@services/utils/validation.js'
import toast from 'react-hot-toast';

export default function RoomCategoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoryData = await roomCategoryService.getById(id);
        setCategory(categoryData[0]);
        
        const amenitiesData = await roomAmenityService.getByCategory(id);
        setAmenities(amenitiesData);
      } catch (err) {
        toast.error(err.message || 'Failed to load room details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary-main" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Category not found</p>
          <Button onClick={() => navigate('/')} icon={ArrowLeft}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Centered Image Section */}
        <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-8 mx-auto" style={{ maxWidth: '900px' }}>
          <img
            src={getImageUrl(category.room_catagory_images)}
            alt={category.room_catagory_name}
            className="w-full h-[600px] object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800';
            }}
          />
        </div>

        {/* Content Section Below Image */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Title and Price */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {category.room_catagory_name}
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary-main">
                  {validationUtils.formatCurrency(category.price_per_night)}
                </span>
                <span className="text-gray-500">per night</span>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {category.room_catagory_description}
              </p>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
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
            )}

            {/* Book Now Button */}
            <div className="border-t border-gray-200 pt-6">
              <Button
                className="w-full"
                size="lg"
                icon={Calendar}
                onClick={() => navigate(`/rooms/category/${id}`)}
              >
                View Available Rooms & Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}