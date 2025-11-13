import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoomCard } from './RoomCategoryCard';
import { roomCategoryService } from '@services/api/api';
import { Loader2 } from 'lucide-react';

export const RoomCategories = ({ searchDates }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await roomCategoryService.getAll();
        setCategories(data?.roomCategory || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section id="rooms" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
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

        <div className="overflow-x-auto overflow-y-hidden pb-4 -mx-4 px-4">
          <div className="flex gap-6 w-max">
            {categories.map((category) => (
              <RoomCard key={category.room_catagory_id} room={category} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};