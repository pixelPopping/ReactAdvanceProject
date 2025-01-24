import React, { useState, useEffect, useCallback } from "react";
import { useLoaderData, useLocation } from "react-router-dom";
import { TextInput } from "../components/ui/TextInput";
import Button from "../components/ui/Button";
import EventCard from "../components/EventCard";
import "./EventsPage.css";

// Loader for initial data fetching
export const loader = async () => {
  const eventsResponse = await fetch("http://localhost:3000/events");
  const categoriesResponse = await fetch("http://localhost:3000/categories");

  if (!eventsResponse.ok || !categoriesResponse.ok) {
    throw new Error("Failed to fetch events or categories");
  }

  const events = await eventsResponse.json();
  const categories = await categoriesResponse.json();

  return { events, categories };
};

export const EventsPage = () => {
  const { events: initialEvents, categories: initialCategories } =
    useLoaderData();
  const location = useLocation();

  const [events, setEvents] = useState(initialEvents);
  const [categories, setCategories] = useState(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: "",
    description: "",
    image: "",
    categoryIds: [],
    date: "",
    time: "",
  });

  // Function to fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on location change
  useEffect(() => {
    fetchData();
  }, [location]);

  // Memoized function to handle search query change
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setSelectedCategory(e.target.value);
  }, []);

  // Filtered events based on search query and selected category
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "" ||
      (Array.isArray(event.categoryIds) &&
        event.categoryIds.includes(Number(selectedCategory)));

    return matchesSearch && matchesCategory;
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategorySelect = (e) => {
    const selectedCategoryIds = Array.from(e.target.selectedOptions, (option) =>
      Number(option.value)
    );
    setNewEventData((prevData) => ({
      ...prevData,
      categoryIds: selectedCategoryIds,
    }));
  };

  const handleAddEventSubmit = async (e) => {
    e.preventDefault();

    if (
      !newEventData.title ||
      !newEventData.description ||
      !newEventData.date ||
      !newEventData.time
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEventData),
      });

      if (!response.ok) {
        throw new Error("Failed to add event");
      }

      const addedEvent = await response.json();
      setEvents((prevEvents) => [...prevEvents, addedEvent]);

      setNewEventData({
        title: "",
        description: "",
        image: "",
        categoryIds: [],
        date: "",
        time: "",
      });
      handleCloseModal();
    } catch (error) {
      console.error("Failed to add event:", error);
    }
  };

  return (
    <div className="events-page">
      <h1 className="heading">Pac-Man Style Events</h1>

      <div className="filters">
        <input
          type="text"
          className="search-input"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for events..."
        />
        <select
          className="category-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredEvents.length === 0 ? (
        <p className="no-events">
          No events found. Try adjusting your search or category filter.
        </p>
      ) : (
        <div className="events-list">
          {filteredEvents.map((event) => {
            const categoryIds = Array.isArray(event.categoryIds)
              ? event.categoryIds
              : [];
            const eventCategories = categoryIds
              .map((categoryId) => {
                const category = categories.find(
                  (cat) => Number(cat.id) === categoryId
                );
                return category;
              })
              .filter(Boolean);

            return (
              <EventCard
                key={event.id}
                event={event}
                categories={eventCategories}
              />
            );
          })}
        </div>
      )}

      <button className="add-event-btn" onClick={handleOpenModal}>
        Add Event
      </button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-modal" onClick={handleCloseModal}>
              &times;
            </span>
            <form onSubmit={handleAddEventSubmit}>
              <label>Event Title</label>
              <input
                name="title"
                value={newEventData.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
              />

              <label>Event Description</label>
              <input
                name="description"
                value={newEventData.description}
                onChange={handleInputChange}
                placeholder="Enter event description"
              />

              <label>Event Image URL</label>
              <input
                name="image"
                value={newEventData.image}
                onChange={handleInputChange}
                placeholder="Enter event image URL"
              />

              <label>Event Categories</label>
              <select
                value={newEventData.categoryIds}
                onChange={handleCategorySelect}
                multiple
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <label>Event Date</label>
              <input
                name="date"
                type="date"
                value={newEventData.date}
                onChange={handleInputChange}
              />

              <label>Event Time</label>
              <input
                name="time"
                type="time"
                value={newEventData.time}
                onChange={handleInputChange}
              />

              <Button type="submit">Add Event</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
