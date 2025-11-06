import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title">Get In Touch</h2>
        <p className="section-subtitle">We'd love to hear from you</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-primary-main" />
            <h3 className="text-xl font-semibold mb-2">Address</h3>
            <p className="text-gray-600">Kathmandu, Nepal</p>
          </div>
          <div className="text-center">
            <Phone className="w-12 h-12 mx-auto mb-4 text-primary-main" />
            <h3 className="text-xl font-semibold mb-2">Phone</h3>
            <p className="text-gray-600">+977 1234567890</p>
          </div>
          <div className="text-center">
            <Mail className="w-12 h-12 mx-auto mb-4 text-primary-main" />
            <h3 className="text-xl font-semibold mb-2">Email</h3>
            <p className="text-gray-600">info@hotelhimalayas.com</p>
          </div>
        </div>
      </div>
    </section>
  );
};
