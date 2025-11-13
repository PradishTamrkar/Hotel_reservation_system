// src/features/admin/roomCategories/RoomCategoriesPage.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@common/Button';
import { Card } from '@common/Card';
import { roomCategoryService, offerService } from '@services/api/api';
import toast from 'react-hot-toast';

import CategoryList from './components/CategoryList';
import CategoryForm from './components/CategoryForm';

export default function RoomCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesData, offersData] = await Promise.all([
        roomCategoryService.getAll(),
        offerService.getAll(),
      ]);
      setCategories(categoriesData?.roomCategory || []);
      setOffers(offersData || []);
    } catch (error) {
      toast.error('Failed to load data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      await roomCategoryService.delete(id);
      toast.success('Category deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to delete category');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCategory(null);
    fetchData();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
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
          <h1 className="text-3xl font-bold">Room Categories</h1>
          <p className="text-gray-600 mt-1">Manage your room categories and pricing</p>
        </div>
        <Button onClick={handleCreate} icon={Plus}>
          Add Category
        </Button>
      </div>

      {showForm ? (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">
            {editingCategory ? 'Edit Category' : 'Create New Category'}
          </h2>
          <CategoryForm
            category={editingCategory}
            offers={offers}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </Card>
      ) : null}

      <CategoryList
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}