import React from 'react';
import { Edit2, Trash2, Package } from 'lucide-react';
import { Card } from '@common/Card';

export default function RoomAmenityList({ roomAmenities, onEdit, onDelete }) {
  if (roomAmenities.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">No room amenities found. Create your first amenity!</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {roomAmenities.map((roomAmenity) => (
        <Card key={roomAmenity.room_amenity_id} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {roomAmenity.room_amenity_name}
              </h3>
              {roomAmenity.room_amenity_description && (
                <p className="text-gray-600 text-sm line-clamp-3">
                  {roomAmenity.room_amenity_description}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-4 pt-4 border-t">
            <button
              onClick={() => onEdit(roomAmenity)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => onDelete(roomAmenity.room_amenity_id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}