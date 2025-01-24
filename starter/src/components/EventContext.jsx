import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const EventsContext = createContext();

// Custom hook to use the events context
export const useEvents = () => useContext(EventsContext);

// Provider component to wrap around your app
export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch events and categories data
  const fetchData = async () => {
    setLoading(true);
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
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Function to add a new event
  const addEvent = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  // Return the context provider with the value of events, categories, etc.
  return (
    <EventsContext.Provider value={{ events, categories, loading, addEvent }}>
      {children}
    </EventsContext.Provider>
  );
};

// Export both named hook and provider
export default EventsContext;
