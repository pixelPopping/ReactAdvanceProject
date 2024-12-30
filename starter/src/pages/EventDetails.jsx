import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";

// Loader function
export const loader = async ({ params }) => {
  const { eventId } = params;

  const eventResponse = await fetch(`http://localhost:3000/events/${eventId}`);
  const categoriesResponse = await fetch(`http://localhost:3000/categories`);

  if (!eventResponse.ok || !categoriesResponse.ok) {
    throw new Error("Failed to fetch data");
  }

  const event = await eventResponse.json();
  const categories = await categoriesResponse.json();

  return { event, categories };
};

const EventDetails = () => {
  const { event: initialEvent, categories } = useLoaderData();
  const [editedEvent, setEditedEvent] = useState({
    ...initialEvent,
    categoryIds: initialEvent.categoryIds || [], // Default to empty array if undefined
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent((prev) => ({
      ...prev,
      [name]:
        name === "categoryIds"
          ? value
              .split(",")
              .map((id) => id.trim())
              .filter(Boolean)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedEvent = {
      ...editedEvent,
      categoryIds: editedEvent.categoryIds.filter(Boolean), // Ensure valid IDs
    };

    try {
      const response = await fetch(
        `http://localhost:3000/events/${initialEvent.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedEvent),
        }
      );

      if (response.ok) {
        console.log("Event updated successfully");
      } else {
        console.error("Failed to update event:", response.status);
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  // Filter categories for display
  const selectedCategories = categories.filter((category) =>
    editedEvent.categoryIds.includes(category.id)
  );

  return (
    <div>
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={editedEvent.title}
          onChange={handleChange}
          placeholder="Event Title"
        />
        <textarea
          name="description"
          value={editedEvent.description}
          onChange={handleChange}
          placeholder="Event Description"
        />
        <input
          type="datetime-local"
          name="startTime"
          value={editedEvent.startTime}
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="endTime"
          value={editedEvent.endTime}
          onChange={handleChange}
        />
        <input
          type="text"
          name="image"
          value={editedEvent.image}
          onChange={handleChange}
          placeholder="Image URL"
        />
        {editedEvent.image && <img src={editedEvent.image} alt="Preview" />}
        <input
          type="text"
          name="categoryIds"
          value={editedEvent.categoryIds.join(", ")}
          onChange={handleChange}
          placeholder="Category IDs (comma-separated)"
        />
        <button type="submit">Save Changes</button>
      </form>

      <h3>Selected Categories</h3>
      {selectedCategories.length > 0 ? (
        <ul>
          {selectedCategories.map((category) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      ) : (
        <p>No categories found for this event.</p>
      )}

      <h3>All Categories</h3>
      <select
        name="categoryIds"
        multiple
        value={editedEvent.categoryIds}
        onChange={(e) => {
          const options = Array.from(e.target.options);
          const selectedIds = options
            .filter((option) => option.selected)
            .map((option) => option.value);
          setEditedEvent((prev) => ({
            ...prev,
            categoryIds: selectedIds,
          }));
        }}
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EventDetails;
