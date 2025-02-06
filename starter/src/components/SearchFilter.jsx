import React from "react";
import "./SearchFilter.css"; // Ensure styles are updated for grid and responsiveness

export const SearchFilter = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  onSearchSubmit, // Handle form submission or button click
}) => {
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearchSubmit(searchQuery, selectedCategory); // Trigger search
  };

  return (
    <div className="search-filter">
      <form onSubmit={handleSearchSubmit} className="search-input-container">
        {/* Search Input */}
        <input
          type="text"
          className="search-input"
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search for events or categories..."
          aria-label="Search for events or categories"
        />
      </form>

      <div className="category-dropdown">
        <select
          className="category-select"
          value={selectedCategory}
          onChange={onCategoryChange}
          aria-label="Select a category"
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
