import React,{useState,useEffect} from "react";
import {Button} from '@common/Button'
import {Input} from '@common/Input'
import { roomCategoryService } from '@services/api/api'
import toast from "react-hot-toast";

export default function CategoryForm({ category, offers, onSuccess, onCancel}) {
    const [formData,setFormData] = useState({
        room_catagory_name: category?.room_catagory_name || '',
        ory_description: category?.room_catagory_description || '',
        price_per_night: category?.price_per_night || '',
        room_catagory_images: category?.room_catagory_images || '',
        offer_id: category?.offer_id || '',
    });
    const [loading,setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!formData.room_catagory_name || !formData.price_per_night){
            toast.error('Please fill in all the required fields');
            return;
        }

        try{
            setLoading(true);
            const payload = {
                ...formData,
                price_per_night: parseFloat(formData.price_per_night),
                offer_id: formData.offer_id || null,
            };

            if(category){
                await roomCategoryService.update(category.room_catagory_id, payload);
                toast.success('Category updated successfully');
            }else{
                await roomCategoryService.create(payload);
                toast.success('Category created successfully');
            }

            onSuccess();
        }catch(error){
            toast.error(error.message || 'Operation failed');
        }finally{
            setLoading(false);
        }
    };
    return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Category Name *"
          value={formData.room_catagory_name}
          onChange={(e) => setFormData({ ...formData, room_catagory_name: e.target.value })}
          placeholder="e.g., Deluxe Suite"
          required
        />

        <Input
          label="Price per Night (Rs) *"
          type="number"
          step="0.01"
          value={formData.price_per_night}
          onChange={(e) => setFormData({ ...formData, price_per_night: e.target.value })}
          placeholder="5000.00"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.room_catagory_description}
          onChange={(e) => setFormData({ ...formData, room_catagory_description: e.target.value })}
          rows="4"
          className="input-field resize-none"
          placeholder="Describe the room category..."
        />
      </div>

      <Input
        label="Image URL"
        value={formData.room_catagory_images}
        onChange={(e) => setFormData({ ...formData, room_catagory_images: e.target.value })}
        placeholder="https://example.com/image.jpg"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Promotional Offer (Optional)
        </label>
        <select
          value={formData.offer_id}
          onChange={(e) => setFormData({ ...formData, offer_id: e.target.value })}
          className="input-field"
        >
          <option value="">No Offer</option>
          {offers.map((offer) => (
            <option key={offer.offer_id} value={offer.offer_id}>
              {offer.offer_name} - {offer.offered_discount}% OFF
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Categories with offers will automatically appear in Exclusive Deals section
        </p>
      </div>

      <div className="flex gap-4">
        <Button type="submit" loading={loading} className="flex-1">
          {category ? 'Update Category' : 'Create Category'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}