import React, { useState, useEffect } from 'react';
import { Hotel, DoorOpen, Tag, Calendar, Mail } from 'lucide-react';
import { Card } from '@common/Card';
import {
  roomCategoryService,
  roomService,
  offerService,
  bookingService,
  contactService
} from '@services/api/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    categories: 0,
    rooms: 0,
    offers: 0,
    bookings: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [categories, rooms, offers, bookings, messages] = await Promise.all([
          roomCategoryService.getAll(),
          roomService.getAll(),
          offerService.getAll(),
          bookingService.getAll(),
          contactService.getAll(),
        ]);

        setStats({
          categories: categories?.roomCategory?.length || 0,
          rooms: rooms?.room?.length || 0,
          offers: offers?.length || 0,
          bookings: bookings?.length || 0,
          messages: messages?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { icon: Hotel, label: 'Room Categories', value: stats.categories, color: 'bg-blue-500' },
    { icon: DoorOpen, label: 'Total Rooms', value: stats.rooms, color: 'bg-green-500' },
    { icon: Tag, label: 'Active Offers', value: stats.offers, color: 'bg-purple-500' },
    { icon: Calendar, label: 'Total Bookings', value: stats.bookings, color: 'bg-orange-500' },
    { icon: Mail, label: 'Messages', value: stats.messages, color: 'bg-pink-500' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}