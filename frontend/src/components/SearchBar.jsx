import React, { useState, useRef } from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search...", 
  initialValue = "",
  className = "" 
}) => {
  const [query, setQuery] = useState(initialValue);
  const inputRef = useRef(null);
  
  const handleChange = (e) => {
    setQuery(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };
  
  const clearSearch = () => {
    setQuery("");
    onSearch("");
    inputRef.current?.focus();
  };
  
  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      {query && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
    </form>
  );
};

export default SearchBar;