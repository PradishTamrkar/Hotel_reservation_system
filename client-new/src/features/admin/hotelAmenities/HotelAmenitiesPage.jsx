import React,{ useState,useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@common/Button";
import { Card } from "@common/Card";
import { hotelAmenityService } from "@services/api/api";
import toast from "react-hot-toast";

import HotelAmenitiesList from "./components/HotelAmenitiesList";
import HotelAmenitiesForm from "./components/HotelAmenitiesForm";

export default function HotelAmenitiesPage() {
    const [hotelAmenities,setHotelAmenities] = useState([]);
    const [loading,setLoading] = useState(true);
    const [showForm,setShowForm] = useState(false);
    const [editingHotelAmenities,setEditingHotelAmenities] = useState(null);

    useEffect(()=>{
        fetchData();
    },[]);

    const fetchData = async () => {
        try{
            setLoading(true);
            const data = hotelAmenityService.getAll();
            setHotelAmenities(data || [])
        }catch(error){
            toast.error('Failed to fetch Hotel Amenities');
            console.log(error);
        }finally{
            setLoading(false);
        }
    };
    
    const handleCreate = () => {
        setEditingHotelAmenities(null);
        setShowForm(true);
    }

    const handleEdit = (hotelAmenity) => {
        setEditingHotelAmenities(hotelAmenity);
        setShowForm(true);
    }

    const handleDelete = async (id) => {
        if(!window.confirm('Are you sure you want to delete this amenity?')){
            return;
        }

        try{
            await hotelAmenityService.delete(id);
            toast.success('Hotel amenity deleted successfully');
            fetchData();
        }catch(error){
            toast.error(error.message || 'Failed to delete Hotel amenity');
        }
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingHotelAmenities(null);
        fetchData();
    }

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingHotelAmenities(null);
    }

    if(loading){
        return(
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold">Hotel Amenities</h1>
                  <p className="text-gray-600 mt-1">Manage your hotel amenities</p>
                </div>
                <Button onClick={handleCreate} icon={Plus}>
                  Add Hotel Amenity
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:gird-cols-3 gap-8">
                <div className={showForm ? 'lg:col-span-2' : 'lg:col-span-3'}>
                            <HotelAmenitiesList
                                hotelAmenities={hotelAmenities}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        </div>
                        {
                            showForm && (
                                <div className="lg-col-span-1">
                                    <Card className='p-6 sticky top-6'>
                                        <h2 className="text-xl font-bold mb-6">
                                            {editingHotelAmenities? 'Edit Hotel Amenity' : 'Create Hotel Amenity'}
                                        </h2>
                                        <HotelAmenitiesPage
                                            hotelAmenities={editingHotelAmenities}
                                            onSuccess={handleFormSuccess}
                                            onCancel={handleFormCancel}
                                        />
                                    </Card>
                                </div>
                            )
                        }
              </div>
        </div>
    )
}