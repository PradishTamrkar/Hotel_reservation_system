import React,{useState,useEffect} from "react";
import { Plus, Loader2, Info } from 'lucide-react';
import { Button } from '@common/Button';
import { Card } from '@common/Card';
import { roomAmenityService } from '@services/api/api';
import toast from 'react-hot-toast';

import RoomAmenityList from "./components/RoomAmenityList";
import RoomAmenityForm from "./components/RoomAmenityForm";

export default function RoomAmenitiesPage(){
    const [roomAmenities,setRoomAmenities]=useState([]);
    const [loading,setLoading] = useState(true);
    const [showForm,setShowForm] = useState(false);
    const [editingAmenity,setEditingAmenity] = useState(null);

    useEffect(() => {
        fetchData();
    },[]);

    const fetchData = async () => {
        try{
            setLoading(true);
            const data = await roomAmenityService.getAll();
            setRoomAmenities(data || []);
        }catch(error){
            toast.error('Failed to fetch room amenity');
            console.error(error);
        }finally{
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingAmenity(null);
        setShowForm(true);
    };

    const handleEdit = (roomAmenity) => {
        setEditingAmenity(roomAmenity);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if(!window.confirm('Are you sure you want to delete this room amenity?')){
            return;
        }

        try{
            await roomAmenityService.delete(id);
            toast.success('Room amenity deleted successfully');
            fetchData();
        }catch(error){
            toast.error(error.message || 'Failed to fetch room amenity');
        }
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingAmenity(null);
        fetchData();
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingAmenity(null);
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
                    <h1 className="text-3xl font-bold">Room Amenities</h1>
                    <p className="text-gray-600 mt-1">Manage amenities that can be assigned to room categories</p>
                </div>
                {!showForm && (
                    <Button onClick={handleCreate} icon={Plus}>
                        Add Room Amenity
                    </Button>
                )}
            </div>

            <Card className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4">
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-blue-900 mb-1">About Room Amenities</h3>
                        <p className="text-blue-800 text-sm">
                            Room amenities are features like Wi-Fi, TV, minibar, etc. that can be assigned to specific room categories. Use the Amenity Bridge section to connect these amenities to room categories.
                        </p>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className={showForm ? 'lg:col-span-2' : 'lg:col-span-3'}>
                    <RoomAmenityList
                        roomAmenities={roomAmenities}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>

                {showForm && (
                    <div className="lg:col-span-1">
                        <Card className="p-6 sticky top-6">
                            <h2 className="text-xl font-bold mb-6">
                                {editingAmenity ? 'Edit Room Amenity' : 'Create Room Amenity'}
                            </h2>
                            <RoomAmenityForm
                                roomAmenity={editingAmenity}
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