import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { bookingService, customerService } from '@services/api/api.js';
import validationUtils from '@services/utils/validation.js';
import authUtils from '@services/utils/auth.js';
import toast from 'react-hot-toast';
import { AuthModal } from '@common/AuthModel';

import GuestInformationForm from '@features/booking/components/GuestInformationForm';
import BookingSummarySidebar from '@features/booking/components/BookingSummarySidebar';
import BookingConfirmDialog from '@features/booking/components/BookingConfirmDialog';

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state?.bookingData;
  const isGuest = location.state?.isGuest;

  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone_no: '',
    gender: '',
    address: '',
    nationality: '',
    citizenship_id: '',
  });

  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!bookingData) {
      navigate('/');
      return;
    }

    // Check if user needs to authenticate
    if (!authUtils.isAuthenticated() && !isGuest) {
      setShowAuthModal(true);
      return;
    }

    const autoFillData = async () => {
      if (authUtils.isAuthenticated() && !isGuest) {
        try {
          const user = authUtils.getCurrentUser();
          const apiData = await customerService.getById(user.id);
          
          setFormData({
            first_name: apiData.first_name || '',
            middle_name: apiData.middle_name || '',
            last_name: apiData.last_name || '',
            email: apiData.email || '',
            phone_no: apiData.phone_no || '',
            gender: apiData.gender || '',
            address: apiData.address || '',
            nationality: apiData.nationality || '',
            citizenship_id: apiData.citizenship_id || '',
          });
          toast.success('Your information has been auto-filled');
        } catch (err) {
          console.error('Error auto-filling:', err);
        }
      }
    };

    autoFillData();
  }, [isGuest, bookingData, navigate]);

  const handleAuthSuccess = (isGuestMode = false) => {
    setShowAuthModal(false);
    if (isGuestMode) {
      // Continue as guest
      navigate('/booking', { state: { bookingData, isGuest: true }, replace: true });
    } else {
      // Logged in, reload the page to auto-fill
      window.location.reload();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.first_name || !formData.last_name || !formData.email ||
        !formData.phone_no || !formData.gender || !formData.address ||
        !formData.nationality || !formData.citizenship_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!validationUtils.isValidEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmBooking = async () => {
    try {
      setLoading(true);
      setShowConfirmDialog(false);

      const payload = {
        ...formData,
        ...bookingData,
      };

      const response = await bookingService.create(payload);

      navigate('/booking/confirmation', {
        state: {
          booking: response,
          bookingDetails: {
            ...bookingData,
            customerInfo: formData,
          },
        },
      });
    } catch (err) {
      toast.error(err.message || 'Failed to create booking');
      setLoading(false);
    }
  };

  if (!bookingData) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <GuestInformationForm
              formData={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </div>

          <div className="lg:col-span-1">
            <BookingSummarySidebar bookingData={bookingData} />
          </div>
        </div>

        <BookingConfirmDialog
          show={showConfirmDialog}
          formData={formData}
          bookingData={bookingData}
          loading={loading}
          onConfirm={handleConfirmBooking}
          onCancel={() => setShowConfirmDialog(false)}
        />

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => navigate('/')}
          onSuccess={handleAuthSuccess}
          bookingData={bookingData}
        />
      </div>
    </div>
  );
}