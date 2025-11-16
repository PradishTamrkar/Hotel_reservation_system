import React, { useState, useEffect } from 'react';
import { Plus, Loader2, Info } from 'lucide-react';
import { Button } from '@common/Button';
import { Card } from '@common/Card';
import { amenityBridgeService, roomCategoryService, roomAmenityService } from '@services/api/api';
import toast from 'react-hot-toast';

import BridgeForm from './components/BridgeForm';
import BridgeList from './components/BridgeList';

export default function AmenityBridgePage() {
  const [bridges, setBridges] = useState([]);
  const [categories, setCategories] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bridgesData, categoriesData, amenitiesData] = await Promise.all([
        amenityBridgeService.getByCategoryId(''),
        roomCategoryService.getAll(),
        roomAmenityService.getAll(),
      ]);
      
      setBridges(bridgesData || []);
      setCategories(categoriesData?.roomCategory || []);
      setAmenities(amenitiesData || []);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this connection?')) {
      return;
    }

    try {
      await amenityBridgeService.delete(id);
      toast.success('Connection removed successfully');
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to remove connection');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchData();
  };

  const handleFormCancel = () => {
    setShowForm(false);
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
          <h1 className="text-3xl font-bold">Amenity Bridge</h1>
          <p className="text-gray-600 mt-1">Connect amenities to room categories</p>
        </div>
        {!showForm && (
          <Button onClick={handleCreate} icon={Plus}>
            Add Connection
          </Button>
        )}
      </div>

      <Card className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">How It Works</h3>
            <p className="text-blue-800 text-sm">
              Use this section to assign room amenities (Wi-Fi, TV, etc.) to specific room categories.
              Each category can have multiple amenities, and each amenity can be assigned to multiple categories.
              These connections will be displayed on room category detail pages.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={showForm ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <BridgeList
            bridges={bridges}
            categories={categories}
            amenities={amenities}
            onDelete={handleDelete}
          />
        </div>

        {showForm && (
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6">Create Connection</h2>
              <BridgeForm
                categories={categories}
                amenities={amenities}
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