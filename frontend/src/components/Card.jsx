import React from "react";

const Card = ({ children, title, className = "", ...props }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
      {...props}
    >
      <div className="p-4">
        {title && <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>}
        {children}
      </div>
    </div>
  );
};

export default Card;