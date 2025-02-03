// SearchFilter.js
import React from "react";
import "./SearchFilter.css"; // Make sure this file has the styles mentioned before

const SearchFilter = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="search-filter">
      <div className="search-input-container">
        <input
          type="text"
          className="search-input"
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search for events or categories..."
        />
        <button className="search-button">Search</button>
      </div>

      <div className="category-dropdown">
        <select
          className="category-select"
          value={selectedCategory}
          onChange={onCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchFilter;
