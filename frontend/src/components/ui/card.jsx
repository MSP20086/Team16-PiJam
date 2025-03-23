import React from 'react';

export const Card = ({ className, children }) => {
  return (
    <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children }) => {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
};

export const CardTitle = ({ className, children }) => {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
};

export const CardDescription = ({ className, children }) => {
  return <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
};

export const CardContent = ({ className, children }) => {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
};
