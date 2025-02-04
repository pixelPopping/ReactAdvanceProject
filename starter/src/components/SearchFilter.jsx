import React from "react";
import "./SearchFilter.css"; // Make sure this file has the styles mentioned before

const SearchFilter = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  onSearchSubmit, // Added to handle form submission or button click
}) => {
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearchSubmit(searchQuery, selectedCategory); // Call the passed function to trigger search
  };

  return (
    <div className="search-filter">
      <form onSubmit={handleSearchSubmit} className="search-input-container">
        <input
          type="text"
          className="search-input"
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search for events or categories..."
          aria-label="Search for events or categories"
        />
        <button type="submit" className="search-button">
          Search
        </button>
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
