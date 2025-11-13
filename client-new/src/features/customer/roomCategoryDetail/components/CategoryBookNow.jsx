import React from "react";
import { Calendar } from "lucide-react";
import { Button } from "@common/Button";

export default function CategoryBookNow({ id, navigate }) {
  return (
    <div className="border-t border-gray-200 pt-6">
      <Button
        className="w-full"
        size="lg"
        icon={Calendar}
        onClick={() => navigate(`/rooms/category/${id}`)}
      >
        View Available Rooms & Book Now
      </Button>
    </div>
  );
}
