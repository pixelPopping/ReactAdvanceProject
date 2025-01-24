import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Assuming you have the users, categories, and events fetched somewhere in the app
const users = [
  // Example user data
  { id: "2", name: "John Doe", image: "https://example.com/john-doe.jpg" },
];
const categories = [
  // Example category data
  { id: 3, name: "Wellness" },
];
const events = [
  // Example event data
  {
    id: "4",
    createdBy: 2,
    title: "Yoga",
    description: "It's a bit of a stretch.",
    image:
      "https://wincacademy.github.io/webpages/media/pexels-gabby-k-5384538.jpg",
    categoryIds: [3],
    location: "Shavasana Yoga School",
    startTime: "2023-03-09T06:00:00.000Z",
    endTime: "2023-03-09T07:00:00.000Z",
  },
];

export const FormPage = () => {
  const { eventId } = useParams(); // Get event ID from URL params
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchedEvent = events.find((event) => event.id === eventId);
    setEvent(fetchedEvent); // Set the event data based on eventId
  }, [eventId]);

  // If event is missing, show a loading message
  if (!event) {
    return <div>Loading...</div>;
  }

  // Get the user who created the event
  const createdByUser = users.find(
    (user) => user.id === String(event.createdBy)
  );

  // Get category names based on categoryIds
  const eventCategories = event.categoryIds.map((id) => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.name : "Unknown category";
  });

  // Format the startTime and endTime
  const startTimeFormatted = new Date(event.startTime).toLocaleString();
  const endTimeFormatted = new Date(event.endTime).toLocaleString();

  return (
    <div className="form-page-container">
      <h2>{event.title}</h2>
      <p>{event.description}</p>

      <div className="event-details">
        <h3>Created by:</h3>
        <div className="created-by">
          <img
            src={createdByUser?.image || "https://via.placeholder.com/150"}
            alt={createdByUser?.name || "Unknown User"}
            className="profile-image"
          />
          <span>{createdByUser?.name || "Unknown User"}</span>
        </div>
      </div>

      <div className="categories">
        <h3>Categories:</h3>
        <p>{eventCategories.join(", ")}</p>
      </div>

      <div className="location">
        <h3>Location:</h3>
        <p>{event.location}</p>
      </div>

      <div className="event-time">
        <h3>Event Time:</h3>
        <p>
          {startTimeFormatted} to {endTimeFormatted}
        </p>
      </div>

      {event.image && (
        <div className="event-image">
          <img src={event.image} alt={event.title} />
        </div>
      )}

      <div className="action-buttons">
        <button className="edit-button">Edit</button>
        <button className="delete-button">Delete</button>
      </div>
    </div>
  );
};

export default FormPage;
