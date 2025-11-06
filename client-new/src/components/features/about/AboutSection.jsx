import React from 'react';
import { Hotel, Users, Award } from 'lucide-react';

export const AboutSection = () => {
  return (
    <section id="about" className="relative py-20 bg-gray-900 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920)',
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">About Hotel Himalayas</h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Experience luxury accommodation in the heart of Kathmandu. With over 20 years of 
          excellence in hospitality, we create unforgettable memories for our guests.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <Users className="w-12 h-12 mx-auto mb-4 text-primary-light" />
            <h3 className="text-3xl font-bold mb-2">500+</h3>
            <p className="text-gray-300">Happy Guests</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <Hotel className="w-12 h-12 mx-auto mb-4 text-primary-light" />
            <h3 className="text-3xl font-bold mb-2">20+</h3>
            <p className="text-gray-300">Luxury Rooms</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <Award className="w-12 h-12 mx-auto mb-4 text-primary-light" />
            <h3 className="text-3xl font-bold mb-2">20+</h3>
            <p className="text-gray-300">Years Experience</p>
          </div>
        </div>
      </div>
    </section>
  );
};
