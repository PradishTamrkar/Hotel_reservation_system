import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@common/Button";
import { roomCategoryService, roomAmenityService } from "@services/api/api.js";
import toast from "react-hot-toast";
import validationUtils from "@services/utils/validation.js";

import CategoryHero from "@features/customer/roomCategoryDetail/components/CategoryHero";
import { OfferBanner }from "@common/OfferBanner";
import CategoryPricing from "@features/customer/roomCategoryDetail/components/CategoryPricing";
import CategoryDescription from "@features/customer/roomCategoryDetail/components/CategoryDescription";
import CategoryAmenities from "@features/customer/roomCategoryDetail/components/CategoryAmenities";
import CategoryBookNow from "@features/customer/roomCategoryDetail/components/CategoryBookNow";

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
        <p className='text-lg text-gray-600'>Loading Category...</p>
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
  const savings = hasOffer ? originalPrice - discountedPrice : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <CategoryHero category={category} hasOffer={hasOffer} />
        <div className="max-w-4xl mx-auto space-y-6">
          {hasOffer && (
            <OfferBanner
              offerName={category.offer_name}
              offerDescription={category.offer_description}
            />
          )}
          <CategoryPricing
            category={category}
            hasOffer={hasOffer}
            originalPrice={originalPrice}
            discountedPrice={discountedPrice}
            savings={savings}
            validationUtils={validationUtils}
          />
          <CategoryDescription description={category.room_catagory_description} />
          <CategoryAmenities amenities={amenities} />
          <CategoryBookNow id={id} navigate={navigate} />
        </div>
      </div>
    </div>
  );
}
