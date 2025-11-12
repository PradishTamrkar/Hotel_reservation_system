import React from "react";

export default function CategoryDescription({ description }) {
  return (
    <div className="border-t border-gray-200 pt-6 mb-6">
      <h2 className="text-xl font-semibold mb-3">Description</h2>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
