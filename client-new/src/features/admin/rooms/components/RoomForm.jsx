import React, { useState } from 'react';
import { Button } from '@common/Button';
import { Input } from '@common/Input';
import { roomService } from '@services/api/api';
import toast from 'react-hot-toast';

export default function RoomForm({ room, categories, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    room_catagory_id: room?.room_catagory_id || '',
    room_no: room?.room_no || '',
    room_description: room?.room_description || '',
    capacity: room?.capacity || '',
    room_status: room?.room_status || 'Available',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.room_catagory_id || !formData.room_no || !formData.capacity) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('room_catagory_id', formData.room_catagory_id);
      formDataToSend.append('room_no', formData.room_no);
      formDataToSend.append('room_description', formData.room_description);
      formDataToSend.append('capacity', formData.capacity);
      formDataToSend.append('room_status', formData.room_status);
      
      if (imageFile) {
        formDataToSend.append('room_images', imageFile);
      }

      if (room) {
        await roomService.update(room.room_id, formDataToSend);
        toast.success('Room updated successfully');
      } else {
        await roomService.create(formDataToSend);
        toast.success('Room created successfully');
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Room Category *
        </label>
        <select
          value={formData.room_catagory_id}
          onChange={(e) => setFormData({ ...formData, room_catagory_id: e.target.value })}
          className="input-field"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.room_catagory_id} value={cat.room_catagory_id}>
              {cat.room_catagory_name}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Room Number *"
        value={formData.room_no}
        onChange={(e) => setFormData({ ...formData, room_no: e.target.value })}
        placeholder="101"
        required
      />

      <Input
        label="Capacity *"
        type="number"
        value={formData.capacity}
        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
        placeholder="2"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.room_description}
          onChange={(e) => setFormData({ ...formData, room_description: e.target.value })}
          rows="3"
          className="input-field resize-none"
          placeholder="Describe the room..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Room Status *
        </label>
        <select
          value={formData.room_status}
          onChange={(e) => setFormData({ ...formData, room_status: e.target.value })}
          className="input-field"
          required
        >
          <option value="Available">Available</option>
          <option value="Not-Available">Not-Available</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Set to "Not-Available" for maintenance or manual blocking
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Room Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="input-field"
        />
      </div>



      <div className="flex gap-3 pt-4">
        <Button type="submit" loading={loading} className="flex-1">
          {room ? 'Update Room' : 'Create Room'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}