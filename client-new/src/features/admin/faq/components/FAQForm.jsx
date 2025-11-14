import React, { useState } from 'react';
import { Button } from '@common/Button';
import { Input } from '@common/Input';
import { faqService } from '@services/api/api';
import toast from 'react-hot-toast';

export default function FAQForm({ faq, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    faq_questions: faq?.faq_questions || '',
    faq_answers: faq?.faq_answers || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.faq_questions || !formData.faq_answers) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);

      if (faq) {
        await faqService.update(faq.faq_id, formData);
        toast.success('FAQ updated successfully');
      } else {
        await faqService.create(formData);
        toast.success('FAQ created successfully');
      }

      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question *
        </label>
        <textarea
          value={formData.faq_questions}
          onChange={(e) => setFormData({ ...formData, faq_questions: e.target.value })}
          rows="3"
          className="input-field resize-none"
          placeholder="What is the check-in time?"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Answer *
        </label>
        <textarea
          value={formData.faq_answers}
          onChange={(e) => setFormData({ ...formData, faq_answers: e.target.value })}
          rows="5"
          className="input-field resize-none"
          placeholder="Check-in time is 2:00 PM..."
          required
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" loading={loading} className="flex-1">
          {faq ? 'Update FAQ' : 'Create FAQ'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}