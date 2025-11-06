import React, { useState } from 'react';
import { Navbar } from '@components/layout/Navbar';
import { HeroSection } from '@components/features/hero/HeroSection';
import { RoomCategories } from '@components/features/rooms/RoomCatagories';
import { AmenitiesSection } from '@components/features/amenities/AmenitiesSection';
import { TestimonialsSection } from '@components/features/testimonials/TestimonialSection';
import { AboutSection } from '@components/features/about/AboutSection';
import { ContactSection } from '@components/features/contact/ContactSection';
import { Footer } from '@components/layout/Footer';

export default function LandingPage() {
  const [searchDates, setSearchDates] = useState({ checkIn: '', checkOut: '' });

  const handleSearch = (checkIn, checkOut) => {
    setSearchDates({ checkIn, checkOut });
    // Scroll to rooms section
    setTimeout(() => {
      document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection onSearch={handleSearch} />
      <RoomCategories searchDates={searchDates} />
      <AmenitiesSection />
      <TestimonialsSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
}