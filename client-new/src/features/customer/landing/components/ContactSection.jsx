import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@common/Button';
import { Input } from '@common/Input';
import { contactService } from '@services/api/api';
import toast from 'react-hot-toast';

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    c_name: '',
    c_email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.c_name || !formData.c_email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.c_email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      
      // Combine subject and message for backend
      const messageWithSubject = `Subject: ${formData.subject}\n\n${formData.message}`;
      
      await contactService.create({
        c_name: formData.c_name,
        c_email: formData.c_email,
        message: messageWithSubject
      });

      toast.success('Message sent successfully! We\'ll get back to you soon.');
      
      // Reset form
      setFormData({
        c_name: '',
        c_email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      toast.error(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
          <p className="text-lg text-gray-600">We'd love to hear from you</p>
        </div>
        
        {/* Contact Form - Centered */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Your Name"
                name="c_name"
                type="text"
                value={formData.c_name}
                onChange={handleChange}
                placeholder="Your Name"
                required
              />

              <Input
                label="Your Email"
                name="c_email"
                type="email"
                value={formData.c_email}
                onChange={handleChange}
                placeholder="Your Email"
                required
              />

              <Input
                label="Subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Booking Inquiry"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="input-field resize-none"
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                icon={Send}
                loading={loading}
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};