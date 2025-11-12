import React from 'react';
import { Hotel } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Hotel className="w-8 h-8" />
              <span className="text-xl font-bold">Hotel Himalayas</span>
            </div>
            <p className="text-gray-400">Your home away from home</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#rooms" className="text-gray-400 hover:text-white">Room Categories</a></li>
              <li><a href="#exclusivedeals" className="text-gray-400 hover:text-white">Exclusive Deals</a></li>
              <li><a href="#amenities" className="text-gray-400 hover:text-white">Amenities</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white">About</a></li>
              <li><a href="#faq" className="text-gray-400 hover:text-white">FAQs</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Kathmandu, Nepal</li>
              <li>+977 4546789</li>
              <li>info@hotelhimalayas.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2025 Hotel Himalayas. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};