import React from "react";
import { SearchX } from "lucide-react";

const EmptyState = ({ 
  title = "No results found", 
  description = "Try adjusting your search or filters", 
  icon: Icon = SearchX,
  action = null 
}) => {
  return (
    <div className="text-center py-12 px-6">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        <Icon size={32} className="text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;