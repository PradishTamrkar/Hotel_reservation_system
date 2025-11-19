// client-new/src/features/customer/landing/components/RoomCategories.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Tag, Sparkles, Loader2 } from 'lucide-react';
import { roomCategoryService } from '@services/api/api';
import { formatters } from '@services/utils/formatters';

export const RoomCategories = ({ searchDates }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await roomCategoryService.getAll();
        const categoryList = data?.roomCategory || [];
        setCategories(categoryList);
        // Set first category as default selected
        if (categoryList.length > 0) {
          setSelectedCategory(categoryList[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const calculateDiscountedPrice = (price, discount) => {
    return price * (1 - discount / 100);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleViewDetails = () => {
    if (selectedCategory) {
      navigate(`/roomCatagory/${selectedCategory.room_catagory_id}`);
    }
  };

  if (loading) {
    return (
      <section id="rooms" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="rooms" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (!selectedCategory || categories.length === 0) {
    return null;
  }

  return (
    <section id="rooms" className="py-20 bg-gradient-to-br from-orange-100 to-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Our Room Categories
          </h2>
          <p className="text-xl text-gray-600">
            Choose from our selection of comfortable and luxurious rooms
          </p>
        </div>

        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px]">
          
          {/* LEFT SIDE - Featured Preview */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-700"
              style={{ 
                backgroundImage: `url(${selectedCategory.room_catagory_images})`,
                transform: 'scale(1.05)'
              }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            {/* Offer Badge */}
            {selectedCategory.offer_id && (
              <div className="absolute top-6 right-6 z-10">
                <div className="bg-red-600 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg animate-pulse">
                  <Tag className="w-5 h-5" />
                  {selectedCategory.offered_discount}% OFF
                </div>
              </div>
            )}

            {/* Content Overlay */}
            <div className="relative h-full min-h-[600px] flex flex-col justify-end p-8 md:p-12 text-white">
              
              {/* Offer Name */}
              {selectedCategory.offer_name && (
                <div className="inline-flex items-center gap-2 bg-orange-500/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4 w-fit">
                  <Sparkles className="w-4 h-4" />
                  {selectedCategory.offer_name}
                </div>
              )}

              {/* Category Name */}
              <h3 className="text-4xl md:text-5xl font-bold mb-4">
                {selectedCategory.room_catagory_name}
              </h3>

              {/* Description */}
              <p className="text-lg text-gray-200 mb-6 max-w-xl leading-relaxed">
                {selectedCategory.room_catagory_description}
              </p>

              {/* Pricing */}
              <div className="mb-6">
                {selectedCategory.offer_id ? (
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-2xl text-gray-400 line-through">
                      {formatters.currency(selectedCategory.price_per_night)}
                    </span>
                    <span className="text-5xl font-bold text-white">
                      {formatters.currency(
                        calculateDiscountedPrice(
                          parseFloat(selectedCategory.price_per_night),
                          selectedCategory.offered_discount
                        )
                      )}
                    </span>
                    <span className="text-gray-300 text-xl">/ night</span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-bold text-white">
                      {formatters.currency(selectedCategory.price_per_night)}
                    </span>
                    <span className="text-gray-300 text-xl">/ night</span>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={handleViewDetails}
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg w-fit group"
              >
                View Details & Book
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* RIGHT SIDE - Category List */}
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {categories.map((category) => (
              <button
                key={category.room_catagory_id}
                onClick={() => handleCategoryClick(category)}
                className={`
                  relative text-left p-6 rounded-xl transition-all duration-300 group
                  ${selectedCategory?.room_catagory_id === category.room_catagory_id
                    ? 'bg-white shadow-xl ring-2 ring-primary scale-[1.02]'
                    : 'bg-white/60 hover:bg-white hover:shadow-lg'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={category.room_catagory_images}
                      alt={category.room_catagory_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400';
                      }}
                    />
                    {category.offer_id && (
                      <div className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                        -{category.offered_discount}%
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                      {category.room_catagory_name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {category.room_catagory_description}
                    </p>
                    
                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      {category.offer_id ? (
                        <>
                          <span className="text-sm text-gray-400 line-through">
                            {formatters.currency(category.price_per_night)}
                          </span>
                          <span className="text-2xl font-bold text-green-600">
                            {formatters.currency(
                              calculateDiscountedPrice(
                                parseFloat(category.price_per_night),
                                category.offered_discount
                              )
                            )}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-gray-900">
                          {formatters.currency(category.price_per_night)}
                        </span>
                      )}
                      <span className="text-sm text-gray-500">/ night</span>
                    </div>
                  </div>

                  {/* Arrow Indicator */}
                  <ChevronRight 
                    className={`
                      w-6 h-6 flex-shrink-0 transition-all
                      ${selectedCategory?.room_catagory_id === category.room_catagory_id
                        ? 'text-primary translate-x-1'
                        : 'text-gray-400 group-hover:translate-x-1 group-hover:text-primary'
                      }
                    `}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};