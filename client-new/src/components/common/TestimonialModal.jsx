import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { Button } from '@common/Button';
import { testimonialService } from '@services/api/api.js';
import toast from 'react-hot-toast';

export const TestimonialModal = ({ isOpen, onClose, bookingId, onSuccess }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!formData.comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    if (formData.comment.trim().length < 10) {
      toast.error('Comment must be at least 10 characters long');
      return;
    }

    try {
      setLoading(true);
      await testimonialService.create(formData);
      toast.success('Thank you for your review!');
      
      // Reset form
      setFormData({ rating: 0, comment: '' });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(bookingId);
      }
      
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          disabled={loading}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-primary fill-primary" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Share Your Experience
            </h2>
            <p className="text-gray-600">
              How was your stay at Hotel Himalayas?
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Rate Your Experience
              </label>
              <div className="flex justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-12 h-12 transition-colors ${
                        star <= (hoveredRating || formData.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-gray-600">
                {formData.rating === 0 && 'Click to rate'}
                {formData.rating === 1 && '⭐ Poor'}
                {formData.rating === 2 && '⭐⭐ Fair'}
                {formData.rating === 3 && '⭐⭐⭐ Good'}
                {formData.rating === 4 && '⭐⭐⭐⭐ Very Good'}
                {formData.rating === 5 && '⭐⭐⭐⭐⭐ Excellent'}
              </p>
            </div>

            {/* Comment Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows="6"
                className="input-field resize-none"
                placeholder="Tell us about your experience... What did you like? What could be improved?"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 10 characters ({formData.comment.length}/10)
              </p>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 Your review helps other guests make informed decisions and helps us improve our service.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                loading={loading}
              >
                Submit Review
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
