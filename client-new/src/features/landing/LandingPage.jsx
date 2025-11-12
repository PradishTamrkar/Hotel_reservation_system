import React, { useState } from 'react';
import { Navbar } from '@layout/Navbar';
import { HeroSection } from '@features/landing/components/HeroSection';
import { RoomCategories } from '@features/landing/components/RoomCategories';
import { ExclusiveDealsSection } from '@features/landing/components/ExclusiveDeals';
import { AmenitiesSection } from '@features/landing/components/AmenitiesSection';
import { TestimonialsSection } from '@features/landing/components/TestimonialSection';
import { AboutSection } from '@features/landing/components/AboutSection';
import { FAQSection } from '@features/landing/components/FaqSection';
import { ContactSection } from '@features/landing/components/ContactSection';
import { Footer } from '@layout/Footer';

export default function LandingPage() {
  const [searchDates, setSearchDates] = useState({ checkIn: '', checkOut: '' });

  const handleSearch = (checkIn, checkOut) => {
    setSearchDates({ checkIn, checkOut });
    setTimeout(() => {
      document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection onSearch={handleSearch} />
      <RoomCategories searchDates={searchDates} />
      <ExclusiveDealsSection />
      <AmenitiesSection />
      <TestimonialsSection />
      <AboutSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
}