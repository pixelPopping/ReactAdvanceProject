import React from "react";
import { Link } from "react-router-dom";
import "./EventCard.css";

const EventCard = ({ event, categories }) => {
  const formatTime = (time) => {
    if (!time) return "";
    const date = new Date(time);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Default event.categoryIds to an empty array if it is null or undefined
  const categoryIds = event.categoryIds || [];

  // Debugging: Log the categories and event categoryIds
  console.log("Categories in EventCard:", categories);
  console.log("Event categoryIds:", categoryIds);

  // Check if categories is an array and contains data
  if (!Array.isArray(categories) || categories.length === 0) {
    console.error(
      "Categories array is empty or not passed correctly:",
      categories
    );
  }

  // Map event categoryIds to their corresponding category objects
  const eventCategories = categoryIds
    .map((categoryId) =>
      categories.find(
        (cat) =>
          Number(cat.id) === Number(categoryId) ||
          String(cat.id) === String(categoryId)
      )
    )
    .filter(Boolean); // Remove any null or undefined values

  console.log("Mapped Event Categories:", eventCategories); // Debugging eventCategories

  // Check if event has an image URL and log it
  if (event.image) {
    console.log("Event Image URL:", event.image);
  }

  return (
    <div className="event-card">
      <Link to={`/event/${event.id}`}>
        <div className="event-image-container">
          {event.image ? (
            <img src={event.image} alt={event.title} className="event-image" />
          ) : (
            <p className="no-image">No Image Available</p>
          )}
        </div>

        <h2 className="event-title">{event.title}</h2>
      </Link>

      <p className="event-description">{event.description}</p>

      <div className="event-details">
        {event.startTime && (
          <p className="event-time">
            Start Time: {formatTime(event.startTime)}
          </p>
        )}
        {event.endTime && (
          <p className="event-time">End Time: {formatTime(event.endTime)}</p>
        )}
        {event.location && (
          <p className="event-location">Location: {event.location}</p>
        )}
      </div>

      <div className="event-categories">
        <h3 className="categories-heading">Categories:</h3>
        {eventCategories.length === 0 ? (
          <p>No categories available</p> // Message if no categories are found
        ) : (
          <div className="categories-list">
            {eventCategories.map((category) => (
              <span key={category.id} className="category-badge">
                {category.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
