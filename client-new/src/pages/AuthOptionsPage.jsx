import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, UserPlus, User, Hotel } from 'lucide-react';
import { Button } from '@components/common/Button';
import { Card } from '@components/common/Card';

export default function AuthOptionsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state?.bookingData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 to-orange-300 flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <Hotel className="w-20 h-20 mx-auto mb-4 text-primary-main" />
          <h1 className="text-4xl font-bold mb-2">How would you like to proceed?</h1>
          <p className="text-gray-600">Choose your preferred booking method</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-8 text-center cursor-pointer hover:shadow-xl transition-all hover:-translate-y-2"
            onClick={() => navigate('/login', { state: { bookingData } })}>
            <LogIn className="w-16 h-16 mx-auto mb-4 text-primary-main" />
            <h2 className="text-2xl font-bold mb-3">Login</h2>
            <p className="text-gray-600 mb-6">Sign in to your existing account</p>
            <Button className="w-full">Login</Button>
          </Card>

          <Card className="p-8 text-center cursor-pointer hover:shadow-xl transition-all hover:-translate-y-2"
            onClick={() => navigate('/signup', { state: { bookingData } })}>
            <UserPlus className="w-16 h-16 mx-auto mb-4 text-secondary-main" />
            <h2 className="text-2xl font-bold mb-3">Sign Up</h2>
            <p className="text-gray-600 mb-6">Create a new account</p>
            <Button variant="secondary" className="w-full">Sign Up</Button>
          </Card>

          <Card className="p-8 text-center cursor-pointer hover:shadow-xl transition-all hover:-translate-y-2"
            onClick={() => navigate('/booking', { state: { bookingData, isGuest: true } })}>
            <User className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h2 className="text-2xl font-bold mb-3">Guest</h2>
            <p className="text-gray-600 mb-6">Book without an account</p>
            <Button variant="outline" className="w-full">Continue as Guest</Button>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}