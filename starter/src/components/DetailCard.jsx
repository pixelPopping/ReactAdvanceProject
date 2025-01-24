import React from "react";

const DetailCard = ({ event, categories, createdByUser }) => {
  const formatTime = (time) => {
    if (!time) return "";
    const date = new Date(time);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="event-detail-card">
      <h1 className="event-details-header">Event Details</h1>

      <div className="event-title">{event.title}</div>
      <img src={event.image} alt={event.title} className="event-image" />
      <div className="event-description">{event.description}</div>
      <div className="event-startTime">
        Start Time: {formatTime(event.startTime)}
      </div>
      <div className="event-endTime">End Time: {formatTime(event.endTime)}</div>
      <div className="event-location">{event.location}</div>

      <div className="event-categories">
        Categories:{" "}
        {categories
          .filter((category) => event.categoryIds.includes(category.id))
          .map((category) => category.name)
          .join(", ")}
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
