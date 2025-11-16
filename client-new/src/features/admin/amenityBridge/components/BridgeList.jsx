import React from 'react';
import { Trash2, ArrowRight, Link2 } from 'lucide-react';
import { Card } from '@common/Card';

export default function BridgeList({ bridges, categories, amenities, onDelete }) {
  // Group bridges by category
  const groupedBridges = bridges.reduce((acc, bridge) => {
    const categoryName = bridge.room_catagory_name || 'Unknown Category';
    if (!acc[categoryName]) {
      acc[categoryName] = {
        category_id: bridge.room_catagory_id,
        category_name: categoryName,
        amenities: []
      };
    }
    acc[categoryName].amenities.push(bridge);
    return acc;
  }, {});

  if (bridges.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Link2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">No connections found. Create your first connection!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {Object.values(groupedBridges).map((group) => (
        <Card key={group.category_id} className="p-6">
          <div className="mb-4 pb-4 border-b">
            <h3 className="text-xl font-bold text-gray-900">
              {group.category_name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {group.amenities.length} amenity/amenities connected
            </p>
          </div>

          <div className="space-y-3">
            {group.amenities.map((bridge) => (
              <div
                key={bridge.catagory_amenity_id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900">
                    {bridge.room_amenity_name}
                  </span>
                </div>

                <button
                  onClick={() => onDelete(bridge.catagory_amenity_id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove connection"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}