import React, { useState, useEffect } from 'react';
import { Loader2, Mail } from 'lucide-react';
import { Card } from '@common/Card';
import { contactService } from '@services/api/api';
import toast from 'react-hot-toast';

import MessageList from './components/MessageList';

export default function ContactMsgPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAll();
      setMessages(data || []);
    } catch (error) {
      toast.error('Failed to load messages');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      await contactService.delete(id);
      toast.success('Message deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to delete message');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Contact Messages</h1>
          <p className="text-gray-600 mt-1">View and manage customer inquiries</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
          <Mail className="w-5 h-5" />
          <span className="font-semibold">{messages.length} Messages</span>
        </div>
      </div>

      <MessageList
        messages={messages}
        onDelete={handleDelete}
      />
    </div>
  );
}