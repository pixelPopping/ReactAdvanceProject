export const SearchFilter = ({ categories, selectedCategory, onCategoryChange }) => (
    <div className="search-filter">
      <select 
        value={selectedCategory} 
        onChange={onCategoryChange} 
        aria-label="Select Category"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
  