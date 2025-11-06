import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardImage = ({ src, alt, className = '' }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-48 object-cover ${className}`}
      onError={(e) => {
        e.target.src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500';
      }}
    />
  );
};

export const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '' }) => {
  return (
    <h3 className={`text-xl font-semibold mb-2 ${className}`}>
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className = '' }) => {
  return (
    <p className={`text-gray-600 ${className}`}>
      {children}
    </p>
  );
};