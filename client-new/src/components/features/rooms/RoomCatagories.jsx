import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RoomCard } from './RoomCard';
import { useRooms } from '@hooks/useRoom';
import { Loader2 } from 'lucide-react';

export const RoomCategories = ({ searchDates }) => {
  const navigate = useNavigate();
  const { rooms, loading, error } = useRooms();

  if (loading) {
    return (
      <section id="rooms" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-main" />
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

  return (
    <section id="rooms" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title">Our Room Categories</h2>
        <p className="section-subtitle">
          Choose from our selection of comfortable and luxurious rooms
        </p>

        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
          {rooms.map((room) => (
            <RoomCard key={room.room_catagory_id} room={room} />
          ))}
        </div>
      </div>
    </section>
  );
};