import React, { useState } from 'react';
import { Trash2, Mail, User, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@common/Card';

export default function MessageList({ messages, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);

  if (messages.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Mail className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">No messages yet</p>
      </Card>
    );
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card key={message.contact_id} className="overflow-hidden">
          <div
            className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleExpand(message.contact_id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-bold text-gray-900">
                    {message.c_name}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Mail className="w-4 h-4" />
                  <span>{message.c_email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(message.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(message.contact_id);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                {expandedId === message.contact_id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {expandedId === message.contact_id && (
            <div className="px-6 pb-6 border-t border-gray-200 pt-4 bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-2">Message:</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}