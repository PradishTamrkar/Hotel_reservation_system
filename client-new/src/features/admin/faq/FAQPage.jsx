import React,{useState,useEffect} from "react";
import { Plus, Loader2, Info } from "lucide-react";
import { Button } from '@common/Button'
import { Card } from '@common/Card'
import { faqService } from "@services/api/api";
import toast from "react-hot-toast";
import FAQList from "./components/FAQList";
import FAQForm from "./components/FAQForm";

export default function FAQPage() {
    const [faqs,setFaqs] = useState([]);
    const [loading,setLoading] = useState(true);
    const [showForm,setShowForm] = useState(false);
    const [editingFAQ,setEditingFAQ] = useState(null);

    useEffect(() => {
        fetchData();
    },[]);

    const fetchData = async () => {
        try{
            setLoading(true);
            const data = await faqService.getAll();
            setFaqs(data || []);
        }catch(error){
            toast.error('Failed to fetch data');
            console.log(error);
        }finally{
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingFAQ(null);
        setShowForm(true);
    }

    const handleEdit = (faq) => {
        setEditingFAQ(faq);
        setShowForm(true);
    }

    const handleDelete = async (id) => {
        if(!window.confirm('Are You sure you want to delete this FAQ?')){
            return;
        }

        try{
            await faqService.delete(id);
            toast.success('FAQ deleted successfully');
            fetchData();
        }catch(error){
            toast.error(error.message || 'Failed to delete FAQ');
        }
    };

    const handleToggleFeatured = async (id) => {
        try{
            await faqService.toggleFAQFeatured(id);
            toast.success('Featured status updated');
            fetchData();
        }catch(error){
            toast.error(error.message || 'Failed to update status');
        }
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingFAQ(null);
        fetchData();
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingFAQ(null);
    };

    if(loading){
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    };

    const featuredCount = faqs.filter(f => f.is_featured).length;

    return(
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">FAQs</h1>
                    <p className="text-gray-600 mt-1">Manage frequently asked questions</p>
                </div>
                {!showForm && (
                    <Button onClick={handleCreate} icon={Plus}>
                        Add FAQ
                    </Button>
                )}
            </div>

            <Card className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4">
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-blue-900 mb-1">Featured FAQs</h3>
                        <p className="text-blue-800 text-sm">
                        Featured FAQs ({featuredCount}/5) appear on the landing page. 
                        You can feature up to 5 FAQs. Toggle the star icon to mark/unmark as featured.
                        </p>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className={showForm? 'lg:col-span-2': 'lg:col-span-3'}>
                    <FAQList 
                        faqs={faqs}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleFeatured={handleToggleFeatured}
                    />
                </div>

                {showForm && (
                    <div className="lg:col-span-1">
                        <Card className="p-6 sticky top-6">
                            <h2 className="text-xl font-bold mb-6">
                                {editingFAQ ? 'Edit FAQ' : 'Create New FAQ'}
                            </h2>
                            <FAQForm
                                faq={editingFAQ}
                                onSuccess={handleFormSuccess}
                                onCancel={handleFormCancel}
                            />
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}