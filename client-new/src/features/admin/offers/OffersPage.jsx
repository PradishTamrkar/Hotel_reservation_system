import React, { useState, useEffect } from 'react';
import { Plus, Loader2, Info } from 'lucide-react';
import { Button } from '@common/Button';
import { Card } from '@common/Card';
import { offerService } from '@services/api/api';
import toast from 'react-hot-toast';

import OfferList from './components/OfferList';
import OfferForm from './components/OfferForm';

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await offerService.getAll();
      setOffers(data || []);
    } catch (error) {
      toast.error('Failed to load offers');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingOffer(null);
    setShowForm(true);
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will remove the offer from all associated room categories.')) {
      return;
    }

    try {
      await offerService.delete(id);
      toast.success('Offer deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to delete offer');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingOffer(null);
    fetchData();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingOffer(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Promotional Offers</h1>
          <p className="text-gray-600 mt-1">Manage promotional offers and discounts</p>
        </div>
        {!showForm && (
          <Button onClick={handleCreate} icon={Plus}>
            Add Offer
          </Button>
        )}
      </div>

      {/* Info Banner */}
      <Card className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">How Offers Work</h3>
            <p className="text-blue-800 text-sm">
              Offers created here can be assigned to room categories. When a category has an offer, 
              it automatically appears in the <strong>Exclusive Deals</strong> section on the landing page 
              with the discounted price displayed.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={showForm ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <OfferList
            offers={offers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {showForm && (
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6">
                {editingOffer ? 'Edit Offer' : 'Create New Offer'}
              </h2>
              <OfferForm
                offer={editingOffer}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}