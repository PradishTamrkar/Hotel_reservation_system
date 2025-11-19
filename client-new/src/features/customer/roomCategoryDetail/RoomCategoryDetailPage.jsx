import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@common/Button";
import { roomCategoryService, roomAmenityService } from "@services/api/api.js";
import toast from "react-hot-toast";
import validationUtils from "@services/utils/validation.js";

import CategoryHero from "@features/customer/roomCategoryDetail/components/CategoryHero";
import CategoryInfo from "@features/customer/roomCategoryDetail/components/CategoryInfo";
import BookingCard from "@features/customer/roomCategoryDetail/components/BookingCard";

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
        toast.error(err.message || "Failed to load room details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-lg text-gray-600 ml-3">Loading Category...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Category not found</p>
          <Button onClick={() => navigate("/")} icon={ArrowLeft}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const hasOffer = category.offer_id && category.offered_discount;
  const originalPrice = parseFloat(category.price_per_night);
  const discountedPrice = hasOffer
    ? originalPrice * (1 - category.offered_discount / 100)
    : originalPrice;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            icon={ArrowLeft}
            size="sm"
          >
            Back to Home
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="lg:col-span-2 space-y-6">
            <CategoryHero category={category} hasOffer={hasOffer} />
            <CategoryInfo
              category={category}
              amenities={amenities}
              hasOffer={hasOffer}
              originalPrice={originalPrice}
              discountedPrice={discountedPrice}
              validationUtils={validationUtils}
            />
          </div>

          {/* Right Column - Booking Card (Sticky) */}
          <div className="lg:col-span-1">
            
            <BookingCard
              id={id}
              category={category}
              hasOffer={hasOffer}
              originalPrice={originalPrice}
              discountedPrice={discountedPrice}
              navigate={navigate}
              validationUtils={validationUtils}
            />
          </div>
        </div>
      </div>
    </div>
  );
}