import React, { useState } from "react";
import "./SearchFilter.css"; // Create this CSS file for styling

export const SearchFilter = ({
  categories = [],
  selectedCategory,
  onCategoryChange,
  onSearch,
  value,
}) => {
  const [searchTerm, setSearchTerm] = useState(value); // Initialize with the value prop

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value); // Propagate the value up to the parent
  };

  const handleCategorySelect = (categoryId) => {
    onCategoryChange(categoryId);
  };

  return (
    <div className="search-filter">
      <div className="search-input-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search events..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="search-button">🔍</button>
      </div>

      <div className="category-dropdown">
        <button className="category-button">
          {categories.find((cat) => cat.id === selectedCategory)?.name ||
            "All Categories"}
        </button>
        <ul className="category-list">
          <li
            className="category-item"
            onClick={() => handleCategorySelect("")}
          >
            All Categories
          </li>
          {categories.map((category) => (
            <li
              key={category.id}
              className="category-item"
              onClick={() => handleCategorySelect(category.id)}
            >
              {category.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchFilter;
