import React from "react";
import { Link } from "react-router-dom";

const EventCard = ({ event, categories }) => {
  const formatTime = (time) => {
    if (!time) return "";
    const date = new Date(time);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

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
        <div className="categories-list">
          {categories.map((category) => (
            <span key={category.id} className="category-badge">
              {category.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
