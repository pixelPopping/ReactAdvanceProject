import React, { useState, useEffect } from "react";
import EventDetails from "./EventDetails";

export const FormPage = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    image: "",
    categoryIds: [],
  });
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/events");
        const events = await response.json();
        setEvents(events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        body: JSON.stringify(newEvent),
        headers: { "Content-Type": "application/json;charset=utf-8" },
      });
      const createdEvent = await response.json();
      setEvents((prevEvents) => [...prevEvents, createdEvent]);

      // Reset form after submission
      setNewEvent({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        image: "",
        categoryIds: [],
      });

      // Clear selection
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleEventUpdate = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev))
    );
    setSelectedEvent(updatedEvent); // Update selected event after modification
  };

  return (
    <div className="App">
      <h1>Create a New Event</h1>
      {/* Always render the form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={newEvent.title}
          onChange={handleChange}
          placeholder="Event Title"
        />
        <textarea
          name="description"
          value={newEvent.description}
          onChange={handleChange}
          placeholder="Event Description"
        />
        <input
          type="datetime-local"
          name="startTime"
          value={newEvent.startTime}
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="endTime"
          value={newEvent.endTime}
          onChange={handleChange}
        />
        <input
          type="text"
          name="image"
          value={newEvent.image}
          onChange={handleChange}
          placeholder="Image URL"
        />
        <input
          type="text"
          name="categoryIds"
          value={newEvent.categoryIds}
          onChange={handleChange}
          placeholder="Category IDs (comma separated)"
        />
        <button type="submit">Create Event</button>
      </form>

      <h2>Events List</h2>
      <ul>
        {events.map((event) => (
          <li
            key={event.id}
            onClick={() => setSelectedEvent(event)} // Select event on click
          >
            {event.title}
          </li>
        ))}
      </ul>

      {/* Render EventDetails if selectedEvent is not null */}
      {selectedEvent && (
        <EventDetails event={selectedEvent} onUpdateEvent={handleEventUpdate} />
      )}
    </div>
  );
};

export default FormPage;
