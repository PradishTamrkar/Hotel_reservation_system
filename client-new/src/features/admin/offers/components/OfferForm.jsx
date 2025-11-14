import React, { useState } from 'react';
import { Button } from '@common/Button';
import { Input } from '@common/Input';
import { offerService } from '@services/api/api';
import toast from 'react-hot-toast';

export default function OfferForm({ offer, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    offer_name: offer?.offer_name || '',
    offer_description: offer?.offer_description || '',
    offered_discount: offer?.offered_discount || '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.offer_name || !formData.offered_discount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const discount = parseFloat(formData.offered_discount);
    if (discount <= 0 || discount > 100) {
      toast.error('Discount must be between 0 and 100');
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('offer_name', formData.offer_name);
      formDataToSend.append('offer_description', formData.offer_description);
      formDataToSend.append('offered_discount', discount);
      
      if (imageFile) {
        formDataToSend.append('offer_image', imageFile);
      }

      if (offer) {
        await offerService.update(offer.offer_id, formDataToSend);
        toast.success('Offer updated successfully');
      } else {
        await offerService.create(formDataToSend);
        toast.success('Offer created successfully');
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
      <Input
        label="Offer Name *"
        value={formData.offer_name}
        onChange={(e) => setFormData({ ...formData, offer_name: e.target.value })}
        placeholder="e.g., Summer Special"
        required
      />

      <Input
        label="Discount Percentage *"
        type="number"
        step="0.01"
        min="0"
        max="100"
        value={formData.offered_discount}
        onChange={(e) => setFormData({ ...formData, offered_discount: e.target.value })}
        placeholder="e.g., 20"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.offer_description}
          onChange={(e) => setFormData({ ...formData, offer_description: e.target.value })}
          rows="4"
          className="input-field resize-none"
          placeholder="Describe the offer..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Offer Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="input-field"
        />
        <p className="text-xs text-gray-500 mt-1">
          This image can be used for promotional materials
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" loading={loading} className="flex-1">
          {offer ? 'Update Offer' : 'Create Offer'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}