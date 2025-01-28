import React, { useState, useEffect } from "react";
import { useLoaderData, useLocation, Link } from "react-router-dom";
import { TextInput } from "../components/ui/TextInput";
import Button from "../components/ui/Button";
import EventCard from "../components/EventCard";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS
import "./EventsPage.css";

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

// Main EventsPage Component
export const EventsPage = () => {
  const { events: initialEvents, categories: initialCategories } =
    useLoaderData();
  const location = useLocation();

  const [events, setEvents] = useState(initialEvents);
  const [categories, setCategories] = useState(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch events and categories when the location changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [eventsResponse, categoriesResponse] = await Promise.all([
          fetch("http://localhost:3000/events"),
          fetch("http://localhost:3000/categories"),
        ]);

        if (!eventsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Failed to fetch events or categories");
        }

        const eventsData = await eventsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setEvents(eventsData);
        setCategories(categoriesData);

        // Trigger toast for successful data load
        // Remove or comment out this line if redundant toast is causing issues
        // toast.success("Events and Categories loaded successfully!");
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load events or categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

  // Filtering events based on search query and selected category
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "" ||
      (Array.isArray(event.categoryIds) &&
        event.categoryIds.some(
          (categoryId) => Number(categoryId) === Number(selectedCategory)
        ));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="events-page">
      <h1 className="heading">Events</h1>

      <div className="filters">
        <TextInput
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

      <Link to="/FormPage">
        <Button>Create New Event</Button>
      </Link>

      {loading ? (
        <p>Loading...</p>
      ) : filteredEvents.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="events-list">
          {filteredEvents.map((event) => {
            // Map categoryIds to category objects
            const eventCategories = event.categoryIds
              .map((categoryId) =>
                categories.find((cat) => Number(categoryId) === Number(cat.id))
              )
              .filter(Boolean); // Filter out undefined values

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
    </div>
  );
};
