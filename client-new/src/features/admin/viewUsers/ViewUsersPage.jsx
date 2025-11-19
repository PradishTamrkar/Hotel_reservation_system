import React, { useState, useEffect } from 'react';
import { Loader2, Users, Search, X, Calendar, ArrowLeft } from 'lucide-react';
import { Card } from '@common/Card';
import { Input } from '@common/Input';
import { Button } from '@common/Button';
import { customerService, bookingService } from '@services/api/api';
import toast from 'react-hot-toast';
import { useDebounce } from '@hooks/useDebounce';
import validationUtils from '@services/utils/validation';

export default function ViewUsersPage() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerBookings, setCustomerBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (debouncedSearch) {
      handleSearch();
    } else {
      fetchCustomers();
    }
  }, [debouncedSearch]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAll();
      setCustomers(data || []);
    } catch (error) {
      toast.error('Failed to load customers');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setSearching(true);
      const data = await customerService.search(debouncedSearch);
      setCustomers(data || []);
    } catch (error) {
      toast.error('Search failed');
      console.error(error);
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchCustomers();
  };

  const handleViewCustomer = async (customer) => {
    setSelectedCustomer(customer);
    try {
      setBookingsLoading(true);
      // Fetch customer's bookings
      const bookings = await bookingService.getByCustomerId(customer.customer_id);
      setCustomerBookings(bookings || []);
    } catch (error) {
      toast.error('Failed to load customer bookings');
      console.error(error);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedCustomer(null);
    setCustomerBookings([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  // Customer Detail View
  if (selectedCustomer) {
    return (
      <div className="p-8">
        <Button
          variant="ghost"
          onClick={handleBackToList}
          icon={ArrowLeft}
          className="mb-6"
        >
          Back to Customers
        </Button>

        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Customer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold">
                {selectedCustomer.first_name} {selectedCustomer.middle_name} {selectedCustomer.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold">{selectedCustomer.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold">{selectedCustomer.phone_no}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="font-semibold">{selectedCustomer.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-semibold">{selectedCustomer.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Nationality</p>
              <p className="font-semibold">{selectedCustomer.nationality}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Citizenship ID</p>
              <p className="font-semibold">{selectedCustomer.citizenship_id}</p>
            </div>
          </div>
        </Card>

        <h3 className="text-xl font-bold mb-4">Booking History</h3>
        
        {bookingsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : customerBookings.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No bookings found for this customer</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {customerBookings.map((booking) => (
              <Card key={booking.booking_id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Booking #{booking.booking_id}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Booked on {validationUtils.formatDate(booking.booking_date)}
                      </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      new Date(booking.check_out_date) < new Date() 
                        ? 'bg-gray-100 text-gray-700'
                        : new Date(booking.check_in_date) <= new Date() && new Date(booking.check_out_date) >= new Date()
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {new Date(booking.check_out_date) < new Date() 
                        ? 'Completed'
                        : new Date(booking.check_in_date) <= new Date() && new Date(booking.check_out_date) >= new Date()
                        ? 'Active'
                        : 'Upcoming'}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Check-in</p>
                      <p className="font-semibold">{validationUtils.formatDate(booking.check_in_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Check-out</p>
                      <p className="font-semibold">{validationUtils.formatDate(booking.check_out_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-semibold text-primary">{validationUtils.formatCurrency(booking.total_amount)}</p>
                    </div>
                  </div>

                  {booking.room_details && booking.room_details.length > 0 && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Room Details:</p>
                      <div className="space-y-2">
                        {booking.room_details.map((room, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{room.room_catagory_name}</p>
                              <p className="text-sm text-gray-600">Room {room.room_no}</p>
                            </div>
                            <p className="text-sm text-gray-600">
                              {validationUtils.formatCurrency(room.price_per_night)} per night
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Customer List View
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-gray-600 mt-1">View and manage customer accounts</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
          <Users className="w-5 h-5" />
          <span className="font-semibold">{customers.length} Total Customers</span>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by name, email, phone, or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {searching && (
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Searching...
          </div>
        )}
      </Card>

      {/* Customer List */}
      {customers.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">
            {searchQuery ? `No customers found matching "${searchQuery}"` : 'No customers found'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <Card key={customer.customer_id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {customer.first_name} {customer.middle_name} {customer.last_name}
                </h3>
                <p className="text-sm text-gray-500">@{customer.customer_username || 'Guest'}</p>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{customer.phone_no}</span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => handleViewCustomer(customer)}
                className="w-full"
              >
                View Details & Bookings
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}