import React from "react";
import "./DetailCard.css"; // Make sure the path is correct

const DetailCard = ({ event = {}, categories = [], createdByUser = null }) => {
  // Function to format time
  const formatTime = (time) => {
    if (!time) return "";
    const date = new Date(time);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Fallback if event data is missing
  if (!event || Object.keys(event).length === 0) {
    return (
      <div>No event details available. Please check if the event exists.</div>
    );
  }

  console.log("Event Category IDs:", event.categoryIds);
  console.log("Categories List:", categories);

  // Check if the event has an image URL and log it
  if (event.image) {
    console.log("Event Image URL:", event.image);
  }

  // Map event categoryIds to their corresponding category objects
  const eventCategories = event.categoryIds
    ? event.categoryIds
        .map((categoryId) =>
          categories.find(
            (cat) => Number(categoryId) === Number(cat.id) // Ensure proper number comparison
          )
        )
        .filter(Boolean) // Filter out null or undefined values
    : [];

  console.log("Mapped Event Categories:", eventCategories);

  return (
    <div className="event-detail-card">
      <h1 className="silkscreenRegular">Event Details</h1>

      <div className="event-title">{event.title}</div>
      {event.image && (
        <img src={event.image} alt={event.title} className="event-image" />
      )}
      <div className="event-description">{event.description}</div>
      <div className="event-startTime">
        Start Time: {formatTime(event.startTime)}
      </div>
      <div className="event-endTime">End Time: {formatTime(event.endTime)}</div>
      <div className="event-location">{event.location}</div>

      {/* Categories Section now under location */}
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

      {createdByUser && (
        <div className="user-info">
          <img src={createdByUser.image} alt={createdByUser.name} width="50" />
          <div className="user-name">Created by: {createdByUser.name}</div>
        </div>
      )}
    </div>
  );
};

export default DetailCard;
