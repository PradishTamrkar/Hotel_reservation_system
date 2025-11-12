import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckCircle, Loader2, Tag, Sparkles } from 'lucide-react';
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
        console.log('Category Data:', categoryData);
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

  // Calculate discounted price if offer exists
  const hasOffer = category.offer_id && category.offered_discount;
  const originalPrice = parseFloat(category.price_per_night);
  const discountedPrice = hasOffer 
    ? originalPrice * (1 - category.offered_discount / 100) 
    : originalPrice;
  const savings = hasOffer ? originalPrice - discountedPrice : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Centered Image Section */}
        <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-8 mx-auto relative" style={{ maxWidth: '900px' }}>
          {/* Special Offer Badge */}
          {hasOffer && (
            <div className="absolute top-6 right-6 z-10 bg-red-600 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg flex items-center gap-2">
              <Tag className="w-6 h-6" />
              {category.offered_discount}% OFF
            </div>
          )}
          
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
            {/* Special Offer Banner */}
            {hasOffer && category.offer_name && (
              <div className="mb-6 bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-bold text-orange-900">{category.offer_name}</h3>
                </div>
                {category.offer_description && (
                  <p className="text-orange-700 text-sm">{category.offer_description}</p>
                )}
              </div>
            )}

            {/* Title and Price */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {category.room_catagory_name}
              </h1>
              
              {/* Price Display with Discount */}
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