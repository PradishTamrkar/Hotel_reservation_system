import React from 'react';
import RoomCard from './RoomCard';

export default function RoomList({
  rooms,
  selectedRooms,
  hasOffer,
  discountAmount,
  originalPrice,
  discountedPrice,
  savingsPerNight,
  onRoomSelect
}) {
  if (rooms.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
        No rooms found in this category
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {rooms.map((room) => (
        <RoomCard
          key={room.room_id}
          room={room}
          isSelected={selectedRooms.includes(room.room_id)}
          hasOffer={hasOffer}
          discountAmount={discountAmount}
          originalPrice={originalPrice}
          discountedPrice={discountedPrice}
          savingsPerNight={savingsPerNight}
          onSelect={onRoomSelect}
        />
      ))}
    </div>
  );
}