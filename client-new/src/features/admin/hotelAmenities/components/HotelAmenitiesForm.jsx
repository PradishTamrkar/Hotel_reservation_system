import React, { useState } from 'react';
import { Button } from '@common/Button';
import { Input } from '@common/Input';
import { hotelAmenityService } from '@services/api/api';
import toast from 'react-hot-toast';

export default function HotelAmenitiesForm({ hotelAmenity, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    hotel_amenity_name: hotelAmenity?.hotel_amenity_name || '',
    hotel_amenity_description: hotelAmenity?.hotel_amenity_description || '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.hotel_amenity_name ) {
      toast.error('Please fill in all the required fields');
      return;
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append('hotel_amenity_name', formData.hotel_amenity_name);
      formDataToSend.append('hotel_amenity_description', formData.hotel_amenity_description);
      
      if (imageFile) {
        formDataToSend.append('hotel_amenity_image', imageFile);
      }

      if (hotelAmenity) {
        await hotelAmenityService.update(hotelAmenity.hotel_amenity_id, formDataToSend);
        toast.success('Hotel amenity updated successfully');
      } else {
        await hotelAmenityService.create(formDataToSend);
        toast.success('Hotel amenity created successfully');
      }

      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Hotel Amenity Name *"
        value={formData.hotel_amenity_name}
        onChange={(e) => setFormData({ ...formData, hotel_amenity_name: e.target.value })}
        placeholder="e.g., Spa"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.hotel_amenity_description}
          onChange={(e) => setFormData({ ...formData, hotel_amenity_description: e.target.value })}
          rows="4"
          className="input-field resize-none"
          placeholder="Describe the hotel amenity..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hotel Amenity Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="input-field"
        />
        {hotelAmenity?.hotel_amenity_image && !imageFile && (
          <p className="text-xs text-gray-500 mt-1">
            Current image will be kept if no new image is selected
          </p>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" loading={loading} className="flex-1">
          {hotelAmenity ? 'Update Hotel Amenity' : 'Create Hotel Amenity'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}