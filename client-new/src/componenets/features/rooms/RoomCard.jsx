import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardImage, CardContent, CardTitle, CardDescription } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { formatters } from '@services/utils/formatters';
import { getImageUrl } from '@services/api';

export const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  return (
    <Card className="flex-shrink-0 w-[350px]">
      <CardImage
        src={getImageUrl(room.room_catagory_images)}
        alt={room.room_catagory_name}
      />
      <CardContent>
        <CardTitle>{room.room_catagory_name}</CardTitle>
        <CardDescription>{room.room_catagory_description}</CardDescription>
        
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-3xl font-bold text-primary">
              {formatters.currency(room.price_per_night)}
            </span>
            <span className="text-gray-500 text-sm">/night</span>
          </div>
          <Button
            size="sm"
            onClick={() => navigate(`/roomCatagory/${room.room_catagory_id}`)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};