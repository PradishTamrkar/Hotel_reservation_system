import React from 'react';

export const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-md overflow-hidden
        ${hover ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardImage = ({ src, alt, className = '' }) => {
  const [error, setError] = React.useState(false);
  
  return (
    <div className="w-full h-48 overflow-hidden bg-gray-100">
      <img
        src={error ? 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500' : src}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        onError={(e) => {
          console.error('Image load error:', src);
          setError(true);
          e.target.src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500';
        }}
        onLoad={() => console.log('✅ Image loaded:', src)}
      />
    </div>
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
    <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${className}`}>
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className = '' }) => {
  return (
    <p className={`text-gray-600 text-sm ${className}`}>
      {children}
    </p>
  );
};