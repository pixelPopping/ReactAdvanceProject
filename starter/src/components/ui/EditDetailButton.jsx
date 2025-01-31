import React, { useState, useEffect } from "react";
import "./EditeDetail.css";

const EditDetailButton = ({ event, onSave }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    ...event,
    categoryIds: event.categoryIds || [],
    imageUrl: event.imageUrl || "",
  });
  const [error, setError] = useState("");
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);
  const [categories, setCategories] = useState([]); // State to hold categories

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/categories"); // Update URL as needed
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data); // Populate categories state
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Open modal and initialize form data
  const openModal = () => {
    setFormData({ ...event, categoryIds: event.categoryIds || [] });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => setIsModalOpen(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const newCategoryIds = checked
        ? [...prev.categoryIds, value]
        : prev.categoryIds.filter((id) => id !== value);
      return { ...prev, categoryIds: newCategoryIds };
    });
  };

  // Save the event data
  const handleSave = () => {
    if (new Date(formData.endTime) < new Date(formData.startTime)) {
      setError("End time cannot be before start time.");
      return;
    }

    onSave({
      ...formData,
      categoryIds: formData.categoryIds.map(String), // Ensure categoryIds are strings
    });
    closeModal();
  };

  // Toggle the visibility of the category checkboxes
  const toggleCategoriesVisibility = () => {
    setIsCategoriesVisible(!isCategoriesVisible);
  };

  return (
    <div>
      <button className="edit-detail-button" onClick={openModal}>
        Edit
      </button>

      {isModalOpen && (
        <div
          className="modal"
          role="dialog"
          aria-labelledby="edit-event-title"
          aria-modal="true"
          onClick={(e) => e.target.className === "modal" && closeModal()}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={closeModal}>
              &times;
            </span>

            <h2>Edit Event</h2>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter event title"
              className="input-field"
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter event description"
              className="input-field"
            />

            <textarea
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter event location"
              className="input-field"
            />

            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              className="input-field"
            />

            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              className="input-field"
            />

            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="Enter image URL"
              className="input-field"
            />

            {error && <div className="error-message">{error}</div>}

            {/* Categories Section */}
            <div className="categories-container">
              <label
                onClick={toggleCategoriesVisibility}
                className="categories-toggle"
              >
                Categories
              </label>

              <div
                className={`category-checkboxes ${
                  isCategoriesVisible ? "visible" : ""
                }`}
              >
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category.id} className="category-checkbox">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        value={category.id}
                        checked={formData.categoryIds.includes(category.id)}
                        onChange={handleCategoryChange}
                      />
                      <label htmlFor={`category-${category.id}`}>
                        {category.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p>Loading categories...</p>
                )}
              </div>
            </div>

            <div className="button-group">
              <button className="submit-button" onClick={handleSave}>
                Save
              </button>
              <button className="cancel-button" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditDetailButton;
