import React, { useState, useEffect } from 'react';
import { Loader2, Info } from 'lucide-react';
import { Card } from '@common/Card';
import { testimonialService } from '@services/api/api';
import toast from 'react-hot-toast';

import TestimonialList from './components/TestimonialsList';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await testimonialService.getAll();
      setTestimonials(data || []);
    } catch (error) {
      toast.error('Failed to load testimonials');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      await testimonialService.delete(id);
      toast.success('Testimonial deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to delete testimonial');
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await testimonialService.toggleTestimonyFeatured(id);
      toast.success('Featured status updated');
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to update featured status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const featuredCount = testimonials.filter(t => t.is_featured).length;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Customer Testimonials</h1>
          <p className="text-gray-600 mt-1">Manage customer reviews and feedback</p>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Featured Testimonials</h3>
            <p className="text-blue-800 text-sm">
              Featured testimonials ({featuredCount}/5) appear on the landing page. 
              You can feature up to 5 testimonials. Toggle the star icon to mark/unmark as featured.
              Testimonials are submitted by customers after their stay.
            </p>
          </div>
        </div>
      </Card>

      <TestimonialList
        testimonials={testimonials}
        onDelete={handleDelete}
        onToggleFeatured={handleToggleFeatured}
      />
    </div>
  );
}