import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@components/common/Button";
import { Input } from "@components/common/Input";
import toast from "react-hot-toast";

export const HeroSection = ({ onSearch }) => {
  const navigate = useNavigate()
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const handleSearch = () => {
    if (!checkIn || !checkOut) {
      toast.error('Please select the check-in and check-out dates');
      return;
    }
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      toast.error('Check-in date cannot be in the past');
      return;
    }

    if (checkOutDate <= checkInDate) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    // Navigate to search results page with date parameters
    navigate(`/search-rooms?check_in=${checkIn}&check_out=${checkOut}`);
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'url(https://i.pinimg.com/1200x/f3/40/cf/f340cff300c3cc33491f5b911455c164.jpg)',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left side - Text */}
          <div className="text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Welcome to Hotel Himalayas
            </h1>
            <p className="text-xl md:text-2xl mb-12 drop-shadow-lg">
              Experience luxury and comfort in the heart of the city
            </p>
          </div>

          {/* Right side - Booking Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="max-w-sm sm:max-w-md bg-white/50 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-2xl">
              <h3 className="align-center text-2xl font-semibold text-gray-900 mb-6">
                Book Your Stay
              </h3>
              <div className="space-y-4">
                <Input
                  type="date"
                  label="Check-in Date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="text-gray-900"
                />
                <Input
                  type="date"
                  label="Check-out Date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  className="text-gray-900"
                />
                <Button
                  onClick={handleSearch}
                  icon={Search}
                  className="w-full"
                  size="lg"
                >
                  Search Available Rooms
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};