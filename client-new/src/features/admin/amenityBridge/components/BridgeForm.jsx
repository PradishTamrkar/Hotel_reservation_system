import React, { useState } from 'react';
import { Button } from '@common/Button';
import { amenityBridgeService } from '@services/api/api';
import toast from 'react-hot-toast';

export default function BridgeForm({ categories, amenities, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    room_catagory_id: '',
    room_amenity_id: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.room_catagory_id || !formData.room_amenity_id) {
      toast.error('Please select both category and amenity');
      return;
    }

    try {
      setLoading(true);
      await amenityBridgeService.create(formData);
      toast.success('Connection created successfully');
      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Failed to create connection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Room Category *
        </label>
        <select
          value={formData.room_catagory_id}
          onChange={(e) => setFormData({ ...formData, room_catagory_id: e.target.value })}
          className="input-field"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.room_catagory_id} value={cat.room_catagory_id}>
              {cat.room_catagory_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Room Amenity *
        </label>
        <select
          value={formData.room_amenity_id}
          onChange={(e) => setFormData({ ...formData, room_amenity_id: e.target.value })}
          className="input-field"
        >
          <option value="">Select Amenity</option>
          {amenities.map((amenity) => (
            <option key={amenity.room_amenity_id} value={amenity.room_amenity_id}>
              {amenity.room_amenity_name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={handleSubmit} loading={loading} className="flex-1">
          Create Connection
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
}