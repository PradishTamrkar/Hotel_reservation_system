import React,{useState,useEffect, use} from "react";
import { Link, useNavigate } from "react-router-dom";
import { Hotel, Menu, X, User, History, LogOut } from 'lucide-react'
import authUtils from '../../services/utils/auth'
import {customerService} from '../../services/api/api'
import { Button } from "../common/Button";

export const Navbar = () => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isUserMenuOpen,setIsUserMenuOpen] = useState(false)
    const [isAuthenticated, setIsAuthenticated]= useState(false)
    const [user,setUser] = useState(null)

    useEffect(()=> {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        const checkAuth = () => {
            const authenticated = authUtils.isAuthenticated();
            setIsAuthenticated(authenticated);

            if(authenticated){
                setUser(authUtils.getCurrentUser())
            }else{
                setUser(null)
            }
        };

        window.addEventListener('scroll',handleScroll);
        window.addEventListener('storage',checkAuth);
        window.addEventListener('authChange', checkAuth);

        checkAuth();

        return () =>{
            window.removeEventListener('scroll',handleScroll);
            window.removeEventListener('storage',checkAuth);
            window.removeEventListener('authChange',checkAuth);
        }; 
    }, []);

    const handleLogout = () => {
        customerService.Logout();
        setIsAuthenticated(false);
        setUser(null);
        setIsUserMenuOpen(false);
        window.dispatchEvent(new Event('authChange'))
        navigate('/');
    };

    const getUserInitials = () => {
        if(user?.customer_username){
            return user.customer_username.charAt(0).toUpperCase();
        }
        return 'U'
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${
                isScrolled ? 'bg-white shadow-md text-gray-900' : 'bg-transparent text-white'
            }`}
        >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
            {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <Hotel className="w-8 h-8" />
                    <span className="text-xl font-bold hidden md:block">Hotel Himalayas</span>
                </Link>

            {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    <a href="#rooms" className="hover:text-primary transition-colors">
                        Room Categories
                    </a>
                    <a href="#exclusivedeals" className="hover:text-primary transition-colors">
                        Exclusive Deals
                    </a>
                <a href="#amenities" className="hover:text-primary transition-colors">
                    Amenities
                </a>
                <a href="#about" className="hover:text-primary transition-colors">
                    About
                </a>
                <a href="#faq" className="hover:text-primary transition-colors">
                    FAQs
                </a>
                <a href="#contact" className="hover:text-primary transition-colors">
                    Contact
                </a>
                </div>



            {/* Auth Buttons */}
                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
                                    ${isScrolled ? 'bg-primary text-white' : 'bg-white text-primary'}
                                `}
                            >
                                {getUserInitials()}
                            </button>

                    {/* User Dropdown */}
                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 text-gray-900">
                                <div className="px-4 py-2 border-b">
                                    <p className="font-semibold">{user?.customer_username}</p>
                                    <p className="text-xs text-gray-500">Customer</p>
                                </div>
                                <button
                                    onClick={() => {
                                        navigate('/booking/history');
                                        setIsUserMenuOpen(false);
                                    }}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                                >
                                <History className="w-4 h-4" />
                                    Booking History
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-red-600"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                        </div>
                    ) : (
                    <>
                        <Button
                            variant={isScrolled ? 'outline' : 'ghost'}
                            size="sm"
                            onClick={() => navigate('/login')}
                            className="hidden sm:flex"
                        >
                        Login
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate('/signup')}
                        >
                        Sign Up
                        </Button>
                    </>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden"
                    >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden py-4 bg-white text-gray-900">
                <a href="#rooms" className="block py-2 hover:text-primary">
                Room Categories
                </a>
                <a href="#exclusivedeals" className="block py-2 hover:text-primary">
                Exclusive Deals
                </a>
                <a href="#amenities" className="block py-2 hover:text-primary">
                Amenities
                </a>
                <a href="#about" className="block py-2 hover:text-primary">
                About
                </a>
                <a href="#contact" className="block py-2 hover:text-primary">
                Contact
                </a>
                </div>
            )}
        </div>
    </nav>
    )
}