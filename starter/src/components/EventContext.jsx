import React, { createContext, useContext, useState } from "react";

// Create Context
const EventsContext = createContext();

// Context Provider
export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchData = async () => {
    try {
      const eventsResponse = await fetch("http://localhost:3000/events");
      const categoriesResponse = await fetch(
        "http://localhost:3000/categories"
      );

      if (!eventsResponse.ok || !categoriesResponse.ok) {
        throw new Error("Failed to fetch events or categories");
      }

      const eventsData = await eventsResponse.json();
      const categoriesData = await categoriesResponse.json();

      setEvents(eventsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const updateEvent = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const addEvent = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const deleteEvent = (eventId) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId)
    );
  };

  return (
    <EventsContext.Provider
      value={{
        events,
        categories,
        fetchData,
        updateEvent,
        addEvent,
        deleteEvent,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};

// Custom hook to use EventsContext
export const useEvents = () => useContext(EventsContext);
