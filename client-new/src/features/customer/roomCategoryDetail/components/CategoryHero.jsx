import React from "react";
import { Tag } from "lucide-react";
import {getImageUrl} from "@services/api/api.js"

export default function CategoryHero({category, hasOffer}){
    return(
        <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-8 mx-auto relative" style={{ maxWidth: "900px"}}>
            {hasOffer && (
                <div className="absolute top-6 right-6 z-10 bg-red-600 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg flex items-center gap-2">
                    <Tag className="w-6 h-6" />
                    {category.offered_discount} % OFF
                </div>
            )}
            <img 
                src={getImageUrl(category.room_catagory_images)}
                alt={category.room_catagory_name}
                className="w-full h-[600px] object-cover"
                onError={(e)=> {
                    e.target.src = "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800"
                }}
            />
        </div>
    )
}