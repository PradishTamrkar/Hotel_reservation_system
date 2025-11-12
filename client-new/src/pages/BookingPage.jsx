import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@common/Button';
import { Input } from '@common/Input';
import { Card } from '@common/Card';
import { bookingService, customerService } from '@services/api/api.js';
import validationUtils from '@services/utils/validation.js'
import authUtils from '@services/utils/auth.js';
import toast from 'react-hot-toast';

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

  useEffect(() => {
    if (!bookingData) {
      navigate('/');
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

  const nights = validationUtils.calculateNights(
    bookingData.check_in_date,
    bookingData.check_out_date
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">

        <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Guest Information Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Guest Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Middle Name"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleChange}
                  />
                  <Input
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Phone Number"
                    name="phone_no"
                    value={formData.phone_no}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <Input
                    label="Nationality"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Citizenship ID"
                    name="citizenship_id"
                    value={formData.citizenship_id}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />

                <Button type="submit" className="w-full" size="lg" loading={loading}>
                  Confirm Booking
                </Button>
              </form>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Check-in</p>
                  <p className="font-medium">{validationUtils.formatDate(bookingData.check_in_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-out</p>
                  <p className="font-medium">{validationUtils.formatDate(bookingData.check_out_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nights</p>
                  <p className="font-medium">{nights} night{nights > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rooms</p>
                  <p className="font-medium">{bookingData.rooms.length} room{bookingData.rooms.length > 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="border-t mt-6 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary-main">
                    {validationUtils.formatCurrency(bookingData.total_amount)}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full p-6">
              <h3 className="text-2xl font-bold mb-4">Confirm Your Booking</h3>
              
              <div className="space-y-2 mb-6 text-sm">
                <p><strong>Guest:</strong> {formData.first_name} {formData.last_name}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Check-in:</strong> {validationUtils.formatDate(bookingData.check_in_date)}</p>
                <p><strong>Check-out:</strong> {validationUtils.formatDate(bookingData.check_out_date)}</p>
                <p><strong>Total:</strong> {validationUtils.formatCurrency(bookingData.total_amount)}</p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmBooking}
                  loading={loading}
                  icon={CheckCircle}
                  className="flex-1"
                >
                  Confirm
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}