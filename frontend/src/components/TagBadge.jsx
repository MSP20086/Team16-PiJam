import React from "react";
import { Tag as TagIcon } from "lucide-react";

// Function to get consistent colors based on tag name
const getTagColor = (tag) => {
  const colors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-purple-100 text-purple-800",
    "bg-yellow-100 text-yellow-800",
    "bg-red-100 text-red-800",
    "bg-indigo-100 text-indigo-800",
    "bg-pink-100 text-pink-800",
    "bg-teal-100 text-teal-800"
  ];
  
  // Simple hash function to get consistent color for same tag
  const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const TagBadge = ({ tag, className = "", ...props }) => {
  const colorClasses = getTagColor(tag);
  
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClasses} ${className}`}
      {...props}
    >
      <TagIcon size={12} className="mr-1" />
      {tag}
    </span>
  );
};

export default TagBadge;