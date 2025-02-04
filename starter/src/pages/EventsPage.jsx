import React, { useState, useEffect } from "react";
import { useLoaderData, useLocation, Link } from "react-router-dom";
import { TextInput } from "../components/ui/TextInput"; // Import your custom TextInput component
import EventCard from "../components/EventCard";
import { toast } from "react-toastify"; // Import toast for success and error messages
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS
import Button from "../components/ui/Button";
import Layout from "../components/Layout"; // Import Layout component
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
  const [toastShown, setToastShown] = useState(false); // Track if toast has been shown

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

        // Show the toast message only once
        if (!toastShown) {
          toast.success("Events loaded successfully!");
          setToastShown(true); // Set toastShown to true after showing the toast
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location, toastShown]); // We use toastShown here to prevent multiple toasts

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

  // Filtering events based on search query and selected category
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categories
        .filter((category) =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .some((category) => event.categoryIds.includes(category.id));

    const matchesCategory =
      selectedCategory === "" ||
      (Array.isArray(event.categoryIds) &&
        event.categoryIds.some(
          (categoryId) => Number(categoryId) === Number(selectedCategory)
        ));

    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="events-page">
        <h1 className="silkscreenRegular">Events</h1>

        <div className="filters">
          {/* Use the custom TextInput component for search */}
          <div className="search-input-container">
            <TextInput
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for events or categories..."
            />
          </div>

          {/* Category filter dropdown */}
          <div className="category-dropdown">
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
                  categories.find(
                    (cat) => Number(categoryId) === Number(cat.id)
                  )
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
    </Layout>
  );
};
