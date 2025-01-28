import React, { useEffect, useState } from "react";
import "./SearchFilter.css";

export const SearchFilter = ({
  categories = [],
  selectedCategory,
  onCategoryChange,
  onSearch,
  value = "",
}) => {
  const [searchTerm, setSearchTerm] = useState(value);

  // Sync local state with the value prop
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
    onSearch(searchValue); // Notify parent component
  };

  const handleCategorySelect = (categoryId) => {
    onCategoryChange(categoryId); // Notify parent component
  };

  return (
    <div className="search-filter">
      {/* Search Input */}
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

      {/* Category Dropdown */}
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
