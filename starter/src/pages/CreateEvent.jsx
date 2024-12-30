import { useState, useEffect } from "react";
import FormPage from "./FormPage"; // Assuming the path is correct
import EventDetails from "./EventDetails"; // Assuming the path is correct

const CreateEvent = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch("http://localhost:3000/events");
      const events = await response.json();
      setEvents(events);
    };
    fetchEvents();
  }, []);

  const createEvent = async (newEvent) => {
    const response = await fetch("http://localhost:3000/events", {
      method: "POST",
      body: JSON.stringify(newEvent),
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    const createdEvent = await response.json();
    setEvents((prevEvents) => [...prevEvents, createdEvent]);
  };

  return (
    <div className="App">
      <h1>Create a New Event</h1>
      <FormPage createEvent={createEvent} />
      <ul>
        {events.map((event) => (
          <li onClick={() => setSelectedEvent(event)} key={event.id}>
            {event.name}
          </li>
        ))}
      </ul>
      {selectedEvent && <EventDetails user={selectedEvent} />}
    </div>
  );
};

export default CreateEvent;
