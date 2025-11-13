import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff } from "lucide-react";
import { Button } from '@common/Button';
import { Input } from '@common/Input';
import { adminService } from "@services/api/api";
import adminAuthUtils from '@services/utils/authAdmin.js';
import toast from "react-hot-toast";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [formData,setFormData] = useState({
        admin_username: '',
        admin_password: '',
    });
    const [showPassword,setShowPassword] = useState(false);
    const [loading,setLoading] = useState(false);

    useEffect(() => {
        if(adminAuthUtils.isAdminAuthenticated()){
            navigate('/admin/dashboard');
        }
    },[navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!formData.admin_username || !formData.admin_password){
            toast.error('Please fill in all the fields');
            return;
        }

        try{
            setLoading(true);
            await adminService.login(formData);

            window.dispatchEvent(new Event('adminAuthChange'));
            toast.success('Admin login successful!');
            navigate('/admin/dashboard');
        }catch(error){
            toast.error(error.message || 'Login failed');
        }finally{
            setLoading(false);
        }
    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Admin Portal</h2>
                    <p className="text-gray-600 mt-2">Hotel Himalayas Management</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Username"
                        value={formData.admin_username}
                        onChange={(e) => setFormData({ ...formData, admin_username: e.target.value })}
                        required
                        autoComplete="username"
                    />

                    <div className="relative">
                        <Input
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.admin_password}
                            onChange={(e) => setFormData({ ...formData, admin_password: e.target.value })}
                            required
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
                        >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    <Button type="submit" className="w-full" loading={loading}>
                        Sign In
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                    ← Back to Main Site
                    </button>
                </div>
            </div>
        </div>
    )
}