import React from 'react';
import { Edit2, Trash2, Users, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@common/Card';
import { getImageUrl } from '@services/api/api';

export default function RoomList({ rooms, categories, onEdit, onDelete }) {
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.room_catagory_id === categoryId);
    return category?.room_catagory_name || 'Unknown';
  };

  if (rooms.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">No rooms found. Create your first room!</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <Card key={room.room_id} className="overflow-hidden">
          <div className="relative h-48">
            <img
              src={getImageUrl(room.room_images)}
              alt={`Room ${room.room_no}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400';
              }}
            />
            {room.room_status === 'Available' ? (
              <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Available
              </div>
            ) : (
              <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                Booked
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">Room {room.room_no}</h3>
            <p className="text-sm text-gray-600 mb-3">{getCategoryName(room.room_catagory_id)}</p>
            
            {room.room_description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {room.room_description}
              </p>
            )}

            <div className="flex items-center gap-2 mb-4 text-gray-700">
              <Users className="w-4 h-4" />
              <span className="text-sm">Capacity: {room.capacity} guests</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(room)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => onDelete(room.room_id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}