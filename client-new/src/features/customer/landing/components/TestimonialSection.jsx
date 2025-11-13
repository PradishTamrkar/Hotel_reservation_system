import React, { useState, useEffect } from 'react';
import { testimonialService } from '@services/api/api';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@common/Card';

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await testimonialService.getAll();
        setTestimonials(data || []);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title">What Our Guests Say</h2>
        <p className="section-subtitle">Real experiences from real guests</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {testimonials.slice(0, 3).map((testimonial) => (
            <Card key={testimonial.testimony_id}>
              <CardContent>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">"{testimonial.comment}"</p>
                <p className="font-semibold">{testimonial.customer_name}</p>
                <p className="text-sm text-gray-500">Verified Guest</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
