import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@common/Button';
import { Card } from '@common/Card';
import { roomService, roomCategoryService } from '@services/api/api';
import toast from 'react-hot-toast';

import RoomList from './components/RoomList';
import RoomForm from './components/RoomForm';

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsData, categoriesData] = await Promise.all([
        roomService.getAll(),
        roomCategoryService.getAll(),
      ]);
      setRooms(roomsData?.room || []);
      setCategories(categoriesData?.roomCategory || []);
    } catch (error) {
      toast.error('Failed to load data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingRoom(null);
    setShowForm(true);
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      await roomService.delete(id);
      toast.success('Room deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to delete room');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingRoom(null);
    fetchData();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingRoom(null);
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
          <h1 className="text-3xl font-bold">Rooms</h1>
          <p className="text-gray-600 mt-1">Manage your hotel rooms</p>
        </div>
        {!showForm && (
          <Button onClick={handleCreate} icon={Plus}>
            Add Room
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={showForm ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <RoomList
            rooms={rooms}
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {showForm && (
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-6">
                {editingRoom ? 'Edit Room' : 'Create New Room'}
              </h2>
              <RoomForm
                room={editingRoom}
                categories={categories}
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
