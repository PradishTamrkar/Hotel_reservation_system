import React, { useState } from 'react';
import { Navbar } from '@components/layout/Navbar';
import { HeroSection } from '@components/features/hero/HeroSection';
import { RoomCategories } from '@components/features/rooms/RoomCatagories';
import { ExclusiveDealsSection } from '@components/features/deals/ExclusiveDeals';
import { AmenitiesSection } from '@components/features/amenities/AmenitiesSection';
import { TestimonialsSection } from '@components/features/testimonials/TestimonialSection';
import { AboutSection } from '@components/features/about/AboutSection';
import { FAQSection } from '@components/features/FAQ/FaqSection';
import { ContactSection } from '@components/features/contact/ContactSection';
import { Footer } from '@components/layout/Footer';

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