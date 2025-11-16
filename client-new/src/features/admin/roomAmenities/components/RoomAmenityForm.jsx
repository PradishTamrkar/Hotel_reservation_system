import React, { useState } from 'react';
import { Button } from '@common/Button';
import { Input } from '@common/Input';
import { roomAmenityService } from '@services/api/api';
import toast from 'react-hot-toast';

export default function RoomAmenityForm({ roomAmenity, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    room_amenity_name: roomAmenity?.room_amenity_name || '',
    room_amenity_description: roomAmenity?.room_amenity_description || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.room_amenity_name) {
      toast.error('Amenity name is required');
      return;
    }

    try {
      setLoading(true);

      if (roomAmenity) {
        await roomAmenityService.update(roomAmenity.room_amenity_id, formData);
        toast.success('Room amenity updated successfully');
      } else {
        await roomAmenityService.create(formData);
        toast.success('Room amenity created successfully');
      }

      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        label="Amenity Name *"
        value={formData.room_amenity_name}
        onChange={(e) => setFormData({ ...formData, room_amenity_name: e.target.value })}
        placeholder="e.g., Wi-Fi, Air Conditioning, TV"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.room_amenity_description}
          onChange={(e) => setFormData({ ...formData, room_amenity_description: e.target.value })}
          rows="4"
          className="input-field resize-none"
          placeholder="Optional description..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={handleSubmit} loading={loading} className="flex-1">
          {roomAmenity ? 'Update Amenity' : 'Create Amenity'}
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
}

