import React from "react";
import { Edit2,Trash2,Star, Brush } from "lucide-react";
import { Card } from '@common/Card';

export default function FAQList({faqs, onEdit, onDelete, onToggleFeatured }){
    if(faqs.length === 0){
        return(
            <Card className="p-8 text-center">
                <p className="text-gray-500">No FAQs Found</p>
            </Card>
        );
    }

    return(
        <div className="space-y-4">
            {faqs.map((faq) => (
                <Card key = {faq.faq_id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {faq.faq_questions}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {faq.faq_answers}
                            </p>
                        </div>
                        <button 
                            onClick={() => onToggleFeatured(faq.faq_id)}
                            className={`ml-4 flex-shrink-0 p-2 rounded-full transition-colors ${
                                faq.is_featured ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                            title={faq.is_featured ? 'Remove from featured' : 'Mark as featured'}
                        >
                            <Star className={`w-5 h-5 ${faq.is_featured ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                    <div className="flex items-center gap-4 pt-4 border-t">
                        {
                            faq.is_featured && (
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">
                                    Featured
                                </span>
                            )
                        }

                        <div className="flex gap-2 ml-auto">
                            <button onClick={() => onEdit(faq)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                                <Edit2 className="w-4 h-4" />
                                Edit                             
                            </button>
                            <button onClick={() => onDelete(faq.faq_id)} className="lex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm">
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}