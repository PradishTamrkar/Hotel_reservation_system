import React, { useState, useEffect } from 'react';
import { Plus, Loader2, Search, X } from 'lucide-react';
import { Button } from '@common/Button';
import { Card } from '@common/Card';
import { Input } from '@common/Input';
import { roomService, roomCategoryService } from '@services/api/api';
import { useDebounce } from '@hooks/useDebounce';  // Add this import
import toast from 'react-hot-toast';

import RoomList from './components/RoomList';
import RoomForm from './components/RoomForm';

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Debounced search term - 500ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-search when debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch(debouncedSearchTerm);
    } else if (isSearching) {
      // Clear search and return to full list
      handleClearSearch();
    }
  }, [debouncedSearchTerm]);

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

  const handleSearch = async (term) => {
    if (!term.trim()) {
      setIsSearching(false);
      fetchData();
      return;
    }

    try {
      setIsSearching(true);
      setLoading(true);
      const searchResults = await roomService.search(term);
      setRooms(searchResults?.room || []);
    } catch (error) {
      toast.error('Search failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    fetchData();
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
      if (isSearching && searchTerm) {
        handleSearch(searchTerm);
      } else {
        fetchData();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete room');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingRoom(null);
    if (isSearching && searchTerm) {
      handleSearch(searchTerm);
    } else {
      fetchData();
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingRoom(null);
  };

  if (loading && !isSearching && rooms.length === 0) {
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

      {/* Search Bar with Debouncing */}
      {!showForm && (
        <Card className="p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by room number... (auto-search as you type)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
                {loading && isSearching && (
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                )}
                {searchTerm && !loading && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Search className="w-4 h-4" />
              <span>Live Search</span>
            </div>
          </div>
          {isSearching && !loading && (
            <p className="text-sm text-gray-600 mt-2">
              Found {rooms.length} room(s) matching "{searchTerm}"
            </p>
          )}
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={showForm ? 'lg:col-span-2' : 'lg:col-span-3'}>
          {loading && rooms.length === 0 ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <RoomList
              rooms={rooms}
              categories={categories}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
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