import React, { useState } from "react";
import "./EditeDetail.css";

const EditDetailButton = ({ event, categories, onSave }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [dateTime, setDateTime] = useState(event.dateTime);
  const [categoryIds, setCategoryIds] = useState(event.categoryIds || []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    const updatedEvent = {
      ...event,
      title,
      description,
      dateTime,
      categoryIds: categoryIds.map(Number),
    };

    onSave(updatedEvent); // Trigger save function from the parent
    closeModal(); // Close the modal after saving
  };

  return (
    <div>
      {/* Button to open the modal */}
      <button className="edit-detail-button" onClick={openModal}>
        Edit
      </button>

      {/* Modal Content */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-modal" onClick={closeModal}>
              &times;
            </span>
            <h2>Edit Event</h2>
            <input
              className="input-field"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event Title"
            />
            <textarea
              className="input-field"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event Description"
            />
            <input
              className="input-field"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
            <label>Categories:</label>
            <select
              className="input-field"
              multiple
              value={categoryIds}
              onChange={(e) =>
                setCategoryIds(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button className="submit-button" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditDetailButton;
