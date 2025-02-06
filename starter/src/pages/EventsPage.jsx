import React, { useState, useEffect } from "react";
import { useLoaderData, useLocation, Link } from "react-router-dom";
import EventCard from "../components/EventCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/ui/Button";
import Layout from "../components/Layout";
import "./EventsPage.css";
import SearchFilter from "../components/SearchFilter"; // Assuming SearchFilter component is correctly imported

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
  const [toastShown, setToastShown] = useState(false);

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

        if (!toastShown) {
          toast.success("Events loaded successfully!");
          setToastShown(true);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location, toastShown]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

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
      {/* Add the class here to apply the background for the full page */}
      <div className="page-with-background">
        <div className="events-page">
          <h1 className="silkscreenRegular">Events</h1>

          {/* Category filter dropdown */}
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            onSearchSubmit={() => console.log("Search Submitted")} // Placeholder submit handler
          />

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
                const eventCategories = event.categoryIds
                  .map((categoryId) =>
                    categories.find(
                      (cat) => Number(categoryId) === Number(cat.id)
                    )
                  )
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
        </div>
      </div>
    </Layout>
  );
};
