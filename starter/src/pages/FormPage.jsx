import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../components/ui/BackButton"; // Adjust path to your BackButton component
import "./FormPage.css";

const categories = [
  { id: "1", name: "Sport" },
  { id: "2", name: "Games" },
  { id: "3", name: "Relaxation" },
  { id: "4", name: "Conferences" },
  { id: "5", name: "Party" },
  { id: "6", name: "Health" },
  { id: "7", name: "Concert" },
  { id: "8", name: "Study" },
  { id: "9", name: "Food" },
  { id: "10", name: "Travel" },
  { id: "11", name: "Dating" },
  { id: "12", name: "Art" },
  { id: "13", name: "Photographic" },
  { id: "14", name: "Cooking" },
];

export const FormPage = ({ onEventCreated }) => {
  const { eventId } = useParams();
  const [event, setEvent] = useState({
    title: "",
    description: "",
    categoryIds: [],
    location: "",
    startTime: "",
    endTime: "",
    image: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(""); // State for error message
  const [categoriesOpen, setCategoriesOpen] = useState(false); // Toggle for category dropdown
  const navigate = useNavigate();

  useEffect(() => {
    if (eventId) {
      const fetchEvent = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/events/${eventId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch event");
          }
          const fetchedEvent = await response.json();
          setEvent(fetchedEvent);
          setIsEditing(true);
        } catch (error) {
          console.error("Error fetching event:", error);
        }
      };
      fetchEvent();
    }
  }, [eventId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setEvent((prevEvent) => {
      const isSelected = prevEvent.categoryIds.includes(categoryId);
      const updatedCategories = isSelected
        ? prevEvent.categoryIds.filter((id) => id !== categoryId)
        : [...prevEvent.categoryIds, categoryId];

      return { ...prevEvent, categoryIds: updatedCategories };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(event.endTime) < new Date(event.startTime)) {
      setError("End time cannot be before start time.");
      return;
    } else {
      setError("");
    }

    const newEvent = {
      title: event.title,
      description: event.description,
      categoryIds: event.categoryIds,
      location: event.location,
      startTime: event.startTime,
      endTime: event.endTime,
      ...(event.image && { image: event.image }),
    };

    try {
      const response = await fetch(
        eventId
          ? `http://localhost:3000/events/${eventId}`
          : "http://localhost:3000/events",
        {
          method: eventId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEvent),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save event: ${errorData.message}`);
      }

      const createdOrUpdatedEvent = await response.json();
      console.log("Event saved successfully:", createdOrUpdatedEvent);

      if (onEventCreated) {
        onEventCreated();
      }

      navigate("/"); // Redirect to events page
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  return (
    <div className="form-page-container">
      <BackButton />
      <h2>{isEditing ? "Edit Event" : "Add New Event"}</h2>

      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="title">Event Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={event.title}
            onChange={handleInputChange}
            required
            className="google-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Event Description</label>
          <textarea
            id="description"
            name="description"
            value={event.description}
            onChange={handleInputChange}
            required
            className="google-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="categories">Categories</label>
          <button
            type="button"
            onClick={() => setCategoriesOpen(!categoriesOpen)}
            className="google-btn"
          >
            {categoriesOpen ? "Hide Categories" : "Select Categories"}
          </button>
          {categoriesOpen && (
            <div className="categories-dropdown">
              {categories.map((category) => (
                <div key={category.id} className="category-item">
                  <label>
                    <input
                      type="checkbox"
                      value={category.id}
                      checked={event.categoryIds.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                    />
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="location">Event Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={event.location}
            onChange={handleInputChange}
            required
            className="google-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="startTime">Start Time</label>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            value={event.startTime}
            onChange={handleInputChange}
            required
            className="google-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="endTime">End Time</label>
          <input
            type="datetime-local"
            id="endTime"
            name="endTime"
            value={event.endTime}
            onChange={handleInputChange}
            required
            className="google-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Event Image URL</label>
          <input
            type="url"
            id="image"
            name="image"
            value={event.image || ""}
            onChange={handleInputChange}
            className="google-input"
          />
        </div>
        <button type="submit" className="google-btn">
          {isEditing ? "Update Event" : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default FormPage;
