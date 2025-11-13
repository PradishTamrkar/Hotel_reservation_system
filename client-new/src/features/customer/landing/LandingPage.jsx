import React, { useState } from 'react';
import { Navbar } from '@layout/Navbar';
import { HeroSection } from '@features/customer/landing/components/HeroSection';
import { RoomCategories } from '@features/customer/landing/components/RoomCategories';
import { ExclusiveDealsSection } from '@features/customer/landing/components/ExclusiveDeals';
import { AmenitiesSection } from '@features/customer/landing/components/AmenitiesSection';
import { TestimonialsSection } from '@features/customer/landing/components/TestimonialSection';
import { AboutSection } from '@features/customer/landing/components/AboutSection';
import { FAQSection } from '@features/customer/landing/components/FaqSection';
import { ContactSection } from '@features/customer/landing/components/ContactSection';
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