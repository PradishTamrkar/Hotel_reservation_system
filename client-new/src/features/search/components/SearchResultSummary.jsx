import React from 'react';

export default function SearchResultsSummary({ totalRooms, totalCategories }) {
  return (
    <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p className="text-blue-900">
        <strong>{totalRooms}</strong> rooms available in{' '}
        <strong>{totalCategories}</strong> categories
      </p>
    </div>
  );
}