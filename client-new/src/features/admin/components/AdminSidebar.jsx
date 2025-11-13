import React from "react";
import { NavLink } from 'react-router-dom'
import { 
    LayoutDashboard,
    Hotel,
    DoorOpen,
    Sparkles,
    Tag,
    HelpCircle,
    MessageSquare,
    Mail,
    Calendar,
    Link2,
    LogOut
} from "lucide-react";
import adminAuthUtils from '@services/utils/authAdmin.js';

export default function AdminSidebar() {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Hotel, label: 'Room Categories', path: '/admin/room-categories' },
        { icon: DoorOpen, label: 'Rooms', path: '/admin/rooms' },
        { icon: Sparkles, label: 'Hotel Amenities', path: '/admin/hotel-amenities' },
        { icon: Tag, label: 'Room Amenities', path: '/admin/room-amenities' },
        { icon: Link2, label: 'Amenity Bridge', path: '/admin/amenity-bridge' },
        { icon: Tag, label: 'Offers', path: '/admin/offers' },
        { icon: HelpCircle, label: 'FAQs', path: '/admin/faq' },
        { icon: MessageSquare, label: 'Testimonials', path: '/admin/testimonials' },
        { icon: Mail, label: 'Messages', path: '/admin/contact-messages' },
        { icon: Calendar, label: 'Bookings', path: '/admin/bookings' },
    ];

    const handleLogout = () => {
        adminAuthUtils.logout();
        window.location.href = '/admin/login'
    };

    return(
        <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
            <div className="p-6">
                <h2 className="text-2xl font-bold">Admin Panel</h2>
                <p className="text-gray-400 text-sm">Hotel Himalayas</p>
            </div>

            <nav className="flex-1 px-4">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                            isActive
                            ? 'bg-primary text-white'
                            : 'text-gray-300 hover:bg-gray-800'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-gray-300 hover:bg-gray-800 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    )
}